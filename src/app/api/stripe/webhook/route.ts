import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { anyApi } from "convex/server";

export const runtime = 'nodejs';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-01-28.clover",
  });
}

function getConvex() {
  return new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
}

// Extract period data from subscription (handles API version differences)
function getPeriodData(subscription: Record<string, unknown>) {
  // Newer Stripe API: period is on items. Fallback to top-level for compat.
  const item = (subscription.items as { data: Array<{ period?: { start: number; end: number } }> })?.data?.[0];
  const periodStart = item?.period?.start ?? (subscription as Record<string, unknown>).current_period_start ?? 0;
  const periodEnd = item?.period?.end ?? (subscription as Record<string, unknown>).current_period_end ?? 0;
  return { periodStart: periodStart as number, periodEnd: periodEnd as number };
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  const convex = getConvex();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Idempotency check — skip if we already processed this event
  const alreadyProcessed = await convex.query(
    anyApi.stripeWebhooks.isEventProcessed,
    { eventId: event.id }
  );
  if (alreadyProcessed) {
    return NextResponse.json({ received: true, skipped: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan || "premium";
        const { periodStart, periodEnd } = getPeriodData(subscription as unknown as Record<string, unknown>);

        if (userId) {
          await convex.mutation(
            anyApi.subscriptions.upsertFromStripe,
            {
              userId,
              plan,
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: subscription.id,
              stripePriceId: subscription.items.data[0].price.id,
              status: subscription.status,
              currentPeriodStart: periodStart,
              currentPeriodEnd: periodEnd,
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            }
          );
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const priceId = subscription.items.data[0].price.id;

        // Detect plan from Stripe Price ID — checks professional tiers first,
        // then student tiers, defaulting to premium if unknown.
        let plan = "premium";
        if (priceId === process.env.STRIPE_PROFESSIONAL_PLUS_PRICE_ID) {
          plan = "professional_plus";
        } else if (priceId === process.env.STRIPE_PROFESSIONAL_PRICE_ID) {
          plan = "professional";
        } else if (priceId === process.env.STRIPE_PREMIUM_PLUS_PRICE_ID) {
          plan = "premium_plus";
        }
        const { periodStart, periodEnd } = getPeriodData(subscription as unknown as Record<string, unknown>);

        const existing = await convex.query(
          anyApi.subscriptions.getByStripeCustomer,
          { stripeCustomerId: subscription.customer as string }
        );

        if (existing && "userId" in existing) {
          await convex.mutation(
            anyApi.subscriptions.upsertFromStripe,
            {
              userId: existing.userId,
              plan,
              stripeCustomerId: subscription.customer as string,
              stripeSubscriptionId: subscription.id,
              stripePriceId: priceId,
              status: subscription.status,
              currentPeriodStart: periodStart,
              currentPeriodEnd: periodEnd,
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            }
          );
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await convex.mutation(
          anyApi.subscriptions.markCanceled,
          { stripeSubscriptionId: subscription.id }
        );
        break;
      }
    }

    // Record event as processed
    await convex.mutation(anyApi.stripeWebhooks.recordProcessedEvent, {
      eventId: event.id,
      eventType: event.type,
    });

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as adminApi from "../adminApi.js";
import type * as ai from "../ai.js";
import type * as aiSessions from "../aiSessions.js";
import type * as ai_argumentBuilder from "../ai/argumentBuilder.js";
import type * as ai_caseBrief from "../ai/caseBrief.js";
import type * as analytics from "../analytics.js";
import type * as appFeedback from "../appFeedback.js";
import type * as attribution from "../attribution.js";
import type * as auditLog from "../auditLog.js";
import type * as auth from "../auth.js";
import type * as backup from "../backup.js";
import type * as badges_queries from "../badges_queries.js";
import type * as bookmarks from "../bookmarks.js";
import type * as careers from "../careers.js";
import type * as certificates from "../certificates.js";
import type * as cpd from "../cpd.js";
import type * as crons from "../crons.js";
import type * as daily from "../daily.js";
import type * as digest from "../digest.js";
import type * as discord from "../discord.js";
import type * as email from "../email.js";
import type * as governance_executive from "../governance/executive.js";
import type * as governance_judicial from "../governance/judicial.js";
import type * as governance_legislative from "../governance/legislative.js";
import type * as governance_tiers from "../governance/tiers.js";
import type * as http from "../http.js";
import type * as lawBook from "../lawBook.js";
import type * as lib_discord from "../lib/discord.js";
import type * as lib_validation from "../lib/validation.js";
import type * as notifications from "../notifications.js";
import type * as posts from "../posts.js";
import type * as profiles from "../profiles.js";
import type * as referrals from "../referrals.js";
import type * as research from "../research.js";
import type * as resources_queries from "../resources_queries.js";
import type * as seed from "../seed.js";
import type * as seedDemo from "../seedDemo.js";
import type * as sessions from "../sessions.js";
import type * as sidebar from "../sidebar.js";
import type * as social from "../social.js";
import type * as stripeWebhooks from "../stripeWebhooks.js";
import type * as subscriptions from "../subscriptions.js";
import type * as users from "../users.js";
import type * as verification from "../verification.js";
import type * as videoSessions from "../videoSessions.js";
import type * as visitorChat from "../visitorChat.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  adminApi: typeof adminApi;
  ai: typeof ai;
  aiSessions: typeof aiSessions;
  "ai/argumentBuilder": typeof ai_argumentBuilder;
  "ai/caseBrief": typeof ai_caseBrief;
  analytics: typeof analytics;
  appFeedback: typeof appFeedback;
  attribution: typeof attribution;
  auditLog: typeof auditLog;
  auth: typeof auth;
  backup: typeof backup;
  badges_queries: typeof badges_queries;
  bookmarks: typeof bookmarks;
  careers: typeof careers;
  certificates: typeof certificates;
  cpd: typeof cpd;
  crons: typeof crons;
  daily: typeof daily;
  digest: typeof digest;
  discord: typeof discord;
  email: typeof email;
  "governance/executive": typeof governance_executive;
  "governance/judicial": typeof governance_judicial;
  "governance/legislative": typeof governance_legislative;
  "governance/tiers": typeof governance_tiers;
  http: typeof http;
  lawBook: typeof lawBook;
  "lib/discord": typeof lib_discord;
  "lib/validation": typeof lib_validation;
  notifications: typeof notifications;
  posts: typeof posts;
  profiles: typeof profiles;
  referrals: typeof referrals;
  research: typeof research;
  resources_queries: typeof resources_queries;
  seed: typeof seed;
  seedDemo: typeof seedDemo;
  sessions: typeof sessions;
  sidebar: typeof sidebar;
  social: typeof social;
  stripeWebhooks: typeof stripeWebhooks;
  subscriptions: typeof subscriptions;
  users: typeof users;
  verification: typeof verification;
  videoSessions: typeof videoSessions;
  visitorChat: typeof visitorChat;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};

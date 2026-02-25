import { Text, Button, Section } from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "./base-layout";

interface SessionReminderEmailProps {
  name: string;
  sessionTitle: string;
  sessionTime: string;
  sessionUrl: string;
}

export function SessionReminderEmail({
  name,
  sessionTitle,
  sessionTime,
  sessionUrl,
}: SessionReminderEmailProps) {
  return (
    <BaseLayout preview={`Reminder: ${sessionTitle} starts in 30 minutes`}>
      <Text style={heading}>Session Reminder</Text>
      <Text style={paragraph}>
        {name}, your session is starting soon.
      </Text>
      <Section style={sessionCard}>
        <Text style={sessionTitle_}>{sessionTitle}</Text>
        <Text style={sessionMeta}>{sessionTime}</Text>
      </Section>
      <Section style={ctaSection}>
        <Button style={ctaButton} href={sessionUrl}>
          Join Session
        </Button>
      </Section>
      <Text style={smallText}>
        You are receiving this because you have session reminders enabled.
        Manage preferences in Settings.
      </Text>
    </BaseLayout>
  );
}

const heading = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: "22px",
  fontWeight: "700" as const,
  color: "#F2EDE6",
  lineHeight: "28px",
  margin: "0 0 16px",
};

const paragraph = {
  color: "rgba(242,237,230,0.6)",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 16px",
};

const sessionCard = {
  backgroundColor: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "14px",
  padding: "16px 20px",
  margin: "0 0 20px",
};

const sessionTitle_ = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: "16px",
  fontWeight: "700" as const,
  color: "#F2EDE6",
  margin: "0 0 4px",
};

const sessionMeta = {
  color: "rgba(242,237,230,0.4)",
  fontSize: "12px",
  margin: "0",
};

const ctaSection = {
  textAlign: "center" as const,
  margin: "0 0 24px",
};

const ctaButton = {
  backgroundColor: "#C9A84C",
  color: "#0C1220",
  fontSize: "14px",
  fontWeight: "700" as const,
  padding: "12px 28px",
  borderRadius: "12px",
  textDecoration: "none",
};

const smallText = {
  color: "rgba(242,237,230,0.3)",
  fontSize: "11px",
  lineHeight: "16px",
  margin: "0",
};

export default SessionReminderEmail;

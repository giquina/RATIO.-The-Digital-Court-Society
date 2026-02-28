import { Text, Button, Section } from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "./base-layout";

interface WelcomeEmailProps {
  name: string;
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <BaseLayout preview="Welcome to Ratio — your advocacy begins now">
      <Text style={heading}>Welcome to the Bar, {name}</Text>
      <Text style={paragraph}>
        Your account has been created. Ratio is a constitutional training ground
        for UK law advocates — practice mooting, build your legal portfolio, and
        advance through the ranks.
      </Text>
      <Text style={paragraph}>Here is how to get started:</Text>
      <Text style={listItem}>1. Complete your profile in Settings</Text>
      <Text style={listItem}>2. Join or create a moot court session</Text>
      <Text style={listItem}>3. Try Moot Court for solo preparation</Text>
      <Section style={ctaSection}>
        <Button style={ctaButton} href="https://ratiothedigitalcourtsociety.com/home">
          Enter the Court
        </Button>
      </Section>
      <Text style={smallText}>
        This is a transactional email confirming your registration. You can
        manage email preferences in Settings.
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
  margin: "0 0 12px",
};

const listItem = {
  color: "rgba(242,237,230,0.6)",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 4px",
  paddingLeft: "8px",
};

const ctaSection = {
  textAlign: "center" as const,
  margin: "24px 0",
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
  margin: "24px 0 0",
};

export default WelcomeEmail;

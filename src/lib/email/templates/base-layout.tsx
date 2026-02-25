import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface BaseLayoutProps {
  preview: string;
  children: React.ReactNode;
}

export function BaseLayout({ preview, children }: BaseLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>
              RATIO<span style={{ color: "#C9A84C" }}>.</span>
            </Text>
          </Section>

          {/* Content */}
          <Section style={content}>{children}</Section>

          {/* Footer */}
          <Hr style={hr} />
          <Section style={footer}>
            <Text style={footerText}>
              Ratio — The Digital Court Society
            </Text>
            <Text style={footerText}>
              Constitutional training for UK law advocates
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#0C1220",
  fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  margin: "0",
  padding: "0",
};

const container = {
  maxWidth: "560px",
  margin: "0 auto",
  padding: "32px 24px",
};

const header = {
  textAlign: "center" as const,
  paddingBottom: "24px",
};

const logo = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: "24px",
  fontWeight: "700" as const,
  color: "#F2EDE6",
  letterSpacing: "0.12em",
  margin: "0",
};

const content = {
  padding: "0",
};

const hr = {
  borderColor: "rgba(255,255,255,0.06)",
  margin: "32px 0 16px",
};

const footer = {
  textAlign: "center" as const,
};

const footerText = {
  color: "rgba(242,237,230,0.3)",
  fontSize: "11px",
  lineHeight: "16px",
  margin: "0",
};

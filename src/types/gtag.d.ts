/* Google Analytics gtag.js type declarations */

interface GtagEventParams {
  page_path?: string;
  page_location?: string;
  page_title?: string;
  send_page_view?: boolean;
  anonymize_ip?: boolean;
  cookie_flags?: string;
  [key: string]: unknown;
}

interface GtagConsentParams {
  analytics_storage?: "granted" | "denied";
  ad_storage?: "granted" | "denied";
  ad_user_data?: "granted" | "denied";
  ad_personalization?: "granted" | "denied";
}

interface Window {
  gtag: (
    command: string,
    targetOrAction: string | Date,
    params?: GtagEventParams | GtagConsentParams,
  ) => void;
  dataLayer: Array<unknown>;
}

import posthog from "posthog-js";

export const analytics = {
  // ── Auth ──────────────────────────────────────────────
  identify(userId: string, properties?: Record<string, unknown>) {
    posthog.identify(userId, properties);
  },

  reset() {
    posthog.reset();
  },

  loginStarted(method: "google" | "email") {
    posthog.capture("login_started", { method });
  },

  loginCompleted(method: "google" | "email", email: string) {
    posthog.capture("login_completed", { method, email });
  },

  signupCompleted(method: "google" | "email", email: string) {
    posthog.capture("signup_completed", { method, email });
  },

  signedOut() {
    posthog.capture("signed_out");
  },

  // ── Newsletter ────────────────────────────────────────
  newsletterSubmitted(email: string) {
    posthog.capture("newsletter_submitted", {
      email_domain: email.split("@")[1],
    });
  },

  // ── Longevity Calculator ──────────────────────────────
  calculatorStarted(data: {
    age: number;
    gender: string;
    bmi: number;
  }) {
    posthog.capture("calculator_started", data);
  },

  calculatorScoreViewed(data: {
    score: number;
    bmi: number;
    has_rhr: boolean;
    has_vo2max: boolean;
    age: number;
    gender: string;
  }) {
    posthog.capture("calculator_score_viewed", data);
  },

  calculatorAdvancedTabOpened() {
    posthog.capture("calculator_advanced_tab_opened");
  },

  calculatorUnlockClicked() {
    posthog.capture("calculator_unlock_clicked");
  },

  calculatorCtaClicked(destination: string) {
    posthog.capture("calculator_cta_clicked", { destination });
  },

  // ── Screening Wizard ──────────────────────────────────
  screeningStepViewed(data: {
    step: number;
    group: string;
    total_steps: number;
  }) {
    posthog.capture("screening_step_viewed", data);
  },

  screeningStepCompleted(data: {
    step: number;
    group: string;
    biomarkers_filled: number;
    biomarkers_total: number;
  }) {
    posthog.capture("screening_step_completed", data);
  },

  screeningCompleted(data: {
    health_score: number;
    confidence_score: number;
    biomarkers_filled: number;
    biomarkers_total: number;
    recommended_protocol: string;
  }) {
    posthog.capture("screening_completed", data);
  },

  screeningProtocolClicked(protocol: string) {
    posthog.capture("screening_protocol_clicked", { protocol });
  },

  screeningRestarted() {
    posthog.capture("screening_restarted");
  },

  // ── Recipes ───────────────────────────────────────────
  recipeSearched(query: string, result_count: number) {
    posthog.capture("recipe_searched", { query, result_count });
  },

  recipeFilterApplied(filter: string | null, result_count: number) {
    posthog.capture("recipe_filter_applied", { filter, result_count });
  },

  // ── FAQ ───────────────────────────────────────────────
  faqSubmitted() {
    posthog.capture("faq_submitted");
  },

  faqLoginRedirect() {
    posthog.capture("faq_login_redirect");
  },

  // ── Language ──────────────────────────────────────────
  languageSwitched(data: { from: string; to: string; page: string }) {
    posthog.capture("language_switched", data);
  },

  // ── Glossary ──────────────────────────────────────────
  glossaryTermViewed(term: string) {
    posthog.capture("glossary_term_viewed", { term });
  },

  // ── CTAs & Links ──────────────────────────────────────
  ctaClicked(data: {
    cta_text: string;
    cta_url: string;
    page: string;
    section?: string;
  }) {
    posthog.capture("cta_clicked", data);
  },

  externalLinkClicked(data: { url: string; text: string; page: string }) {
    posthog.capture("external_link_clicked", data);
  },
} as const;

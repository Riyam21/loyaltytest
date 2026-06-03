// The single outbound messaging port. All slices send customer messages
// through this interface so the channel/provider is swappable (WhatsApp BSP
// now, SMS fallback later). The real BSP adapter (issue #11) and the
// in-memory fake (tests) both implement this.

export type LanguageCode = "ar" | "en";

export interface OutboundMessage {
  /** Recipient phone number in E.164 form, e.g. +97450000000 */
  to: string;
  /** Approved template name, e.g. "welcome" | "progress" | "reward_earned" | "redeem_receipt" */
  template: string;
  /** Customer's preferred language for the template. */
  language: LanguageCode;
  /** Template variable substitutions (café name, progress counts, etc.). */
  variables?: Record<string, string>;
}

export interface MessageSender {
  send(message: OutboundMessage): Promise<void>;
}

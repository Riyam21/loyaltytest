import type { MessageSender, OutboundMessage } from "./message-sender";

// Real outbound adapter behind the MessageSender port. Models the WhatsApp
// Cloud API template-message shape, which flat-fee BSPs (e.g. 360dialog) proxy.
// Endpoint + headers are injected so the same adapter works whether we go
// Cloud-API-direct (Authorization: Bearer) or via a BSP (custom key header).
//
// NOTE (issue #11): this is the code half. The human/HITL half — Meta business
// verification for the Qatar entity and approval of the bilingual utility
// templates (welcome, progress, reward_earned, redeem_receipt) — must complete
// before live sends succeed.

export type FetchLike = (
  url: string,
  init: {
    method: string;
    headers: Record<string, string>;
    body: string;
  },
) => Promise<{ ok: boolean; status: number; text: () => Promise<string> }>;

export interface WhatsAppBspConfig {
  /** Full URL to POST messages to (BSP- or Cloud-API-specific). */
  endpoint: string;
  /** Auth + content headers (e.g. { Authorization: "Bearer ..." } or { "D360-API-KEY": "..." }). */
  headers: Record<string, string>;
}

/** Strip a leading "+" — WhatsApp expects E.164 digits without it. */
function normalizeRecipient(to: string): string {
  return to.startsWith("+") ? to.slice(1) : to;
}

/** Map ordered variable values to positional WhatsApp body parameters. */
function bodyParameters(variables?: Record<string, string>) {
  const values = Object.values(variables ?? {});
  if (values.length === 0) return [];
  return [
    {
      type: "body",
      parameters: values.map((text) => ({ type: "text", text })),
    },
  ];
}

export function buildTemplatePayload(message: OutboundMessage) {
  return {
    messaging_product: "whatsapp",
    to: normalizeRecipient(message.to),
    type: "template",
    template: {
      name: message.template,
      language: { code: message.language },
      components: bodyParameters(message.variables),
    },
  };
}

export class WhatsAppBspMessageSender implements MessageSender {
  constructor(
    private readonly config: WhatsAppBspConfig,
    private readonly fetchFn: FetchLike = globalThis.fetch as unknown as FetchLike,
  ) {}

  async send(message: OutboundMessage): Promise<void> {
    const res = await this.fetchFn(this.config.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...this.config.headers },
      body: JSON.stringify(buildTemplatePayload(message)),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(
        `WhatsApp send failed (${res.status}) for template "${message.template}": ${detail}`,
      );
    }
  }
}

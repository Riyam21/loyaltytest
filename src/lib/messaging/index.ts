import { InMemoryMessageSender } from "./in-memory-message-sender";
import type { MessageSender } from "./message-sender";
import { WhatsAppBspMessageSender } from "./whatsapp-bsp-message-sender";

export type { MessageSender, OutboundMessage, LanguageCode } from "./message-sender";
export { InMemoryMessageSender } from "./in-memory-message-sender";
export { WhatsAppBspMessageSender, buildTemplatePayload } from "./whatsapp-bsp-message-sender";

// Selects the outbound sender from the environment. When the WhatsApp BSP is
// configured (post Meta verification, issue #11) the real adapter is used;
// otherwise the in-memory fake keeps dev/test working with no provider.
export function createMessageSender(
  env: NodeJS.ProcessEnv = process.env,
): MessageSender {
  const endpoint = env.WHATSAPP_ENDPOINT;
  const token = env.WHATSAPP_TOKEN;
  const apiKey = env.WHATSAPP_API_KEY;

  if (endpoint && (token || apiKey)) {
    const headers: Record<string, string> = token
      ? { Authorization: `Bearer ${token}` }
      : { "D360-API-KEY": apiKey as string };
    return new WhatsAppBspMessageSender({ endpoint, headers });
  }

  return new InMemoryMessageSender();
}

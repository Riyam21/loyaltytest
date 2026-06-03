import type { MessageSender, OutboundMessage } from "./message-sender";

// Test double for the MessageSender port. Records every dispatched message so
// tests can assert recipient, template, language, and variables without
// touching a real provider.

export class InMemoryMessageSender implements MessageSender {
  public readonly sent: OutboundMessage[] = [];

  async send(message: OutboundMessage): Promise<void> {
    this.sent.push(message);
  }

  reset(): void {
    this.sent.length = 0;
  }
}

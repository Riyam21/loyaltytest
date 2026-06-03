import { expect, test, vi } from "vitest";
import {
  WhatsAppBspMessageSender,
  buildTemplatePayload,
  type FetchLike,
} from "../src/lib/messaging/whatsapp-bsp-message-sender";
import { createMessageSender } from "../src/lib/messaging";
import { InMemoryMessageSender } from "../src/lib/messaging/in-memory-message-sender";

const okFetch = (): FetchLike =>
  vi.fn(async () => ({ ok: true, status: 200, text: async () => "" }));

test("builds a WhatsApp template payload with stripped recipient and positional params", () => {
  const payload = buildTemplatePayload({
    to: "+97450000000",
    template: "progress",
    language: "ar",
    variables: { cafeName: "Joe's Café", count: "7", goal: "9" },
  });

  expect(payload).toMatchObject({
    messaging_product: "whatsapp",
    to: "97450000000", // leading + stripped
    type: "template",
    template: {
      name: "progress",
      language: { code: "ar" },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: "Joe's Café" },
            { type: "text", text: "7" },
            { type: "text", text: "9" },
          ],
        },
      ],
    },
  });
});

test("omits the body component when there are no variables", () => {
  const payload = buildTemplatePayload({
    to: "97450000000",
    template: "welcome",
    language: "en",
  });
  expect(payload.template.components).toEqual([]);
});

test("POSTs to the configured endpoint with auth and JSON headers", async () => {
  const fetchFn = okFetch();
  const sender = new WhatsAppBspMessageSender(
    { endpoint: "https://bsp.example/v1/messages", headers: { Authorization: "Bearer abc" } },
    fetchFn,
  );

  await sender.send({ to: "+97455555555", template: "welcome", language: "en" });

  expect(fetchFn).toHaveBeenCalledOnce();
  const [url, init] = (fetchFn as ReturnType<typeof vi.fn>).mock.calls[0];
  expect(url).toBe("https://bsp.example/v1/messages");
  expect(init.method).toBe("POST");
  expect(init.headers).toMatchObject({
    "Content-Type": "application/json",
    Authorization: "Bearer abc",
  });
  expect(JSON.parse(init.body)).toMatchObject({ messaging_product: "whatsapp" });
});

test("throws with status and detail on a non-2xx response", async () => {
  const fetchFn: FetchLike = async () => ({
    ok: false,
    status: 401,
    text: async () => "invalid token",
  });
  const sender = new WhatsAppBspMessageSender(
    { endpoint: "https://bsp.example/v1/messages", headers: {} },
    fetchFn,
  );

  await expect(
    sender.send({ to: "+97455555555", template: "welcome", language: "en" }),
  ).rejects.toThrow(/401.*invalid token/);
});

test("factory falls back to the in-memory sender when unconfigured", () => {
  expect(createMessageSender({} as NodeJS.ProcessEnv)).toBeInstanceOf(InMemoryMessageSender);
});

test("factory returns the BSP adapter when endpoint + credential are set", () => {
  const sender = createMessageSender({
    WHATSAPP_ENDPOINT: "https://bsp.example/v1/messages",
    WHATSAPP_API_KEY: "key123",
  } as NodeJS.ProcessEnv);
  expect(sender).toBeInstanceOf(WhatsAppBspMessageSender);
});

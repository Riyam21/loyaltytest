import { expect, test } from "vitest";
import { InMemoryMessageSender } from "../src/lib/messaging/in-memory-message-sender";

test("the in-memory sender records dispatched messages", async () => {
  const sender = new InMemoryMessageSender();

  await sender.send({
    to: "+97450000000",
    template: "welcome",
    language: "ar",
    variables: { cafeName: "Joe's Café" },
  });

  expect(sender.sent).toHaveLength(1);
  expect(sender.sent[0]).toMatchObject({
    to: "+97450000000",
    template: "welcome",
    language: "ar",
    variables: { cafeName: "Joe's Café" },
  });
});

test("reset clears recorded messages", async () => {
  const sender = new InMemoryMessageSender();
  await sender.send({ to: "+97450000001", template: "progress", language: "en" });

  sender.reset();

  expect(sender.sent).toHaveLength(0);
});

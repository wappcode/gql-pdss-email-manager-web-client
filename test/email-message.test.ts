import { expect, test } from "vitest";
import {
  createEmailMessageInputFormEmailMessage,
  deleteEmailMessage,
  getEmailMessage,
  getEmailMessages,
  updateEmailMessage,
} from "../src/lib/email-message.fn";
import { queryExecutor } from "./query-executor";
import { createMessage } from "./utilities/email-message";

test("Test Email Message CRUD", async () => {
  const message = await createMessage();
  expect(message).not.toBeUndefined();
  expect(message?.id).not.toBeUndefined();

  const messages = await getEmailMessages(queryExecutor);
  expect(messages.totalCount).toBeGreaterThan(0);

  const message2 = await getEmailMessage(queryExecutor, message!.id);

  expect(message2?.id).toBeTruthy();
  const input = createEmailMessageInputFormEmailMessage(message!);

  const message3 = await updateEmailMessage(queryExecutor, message!.id, input);
  expect(message3?.id).toBeTruthy();

  const deleteSuccess = await deleteEmailMessage(queryExecutor, message!.id);

  expect(deleteSuccess).toBe(true);
});

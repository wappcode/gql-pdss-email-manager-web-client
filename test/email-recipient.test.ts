import { describe, expect, test } from "vitest";
import {
  deleteEmailRecipient,
  forwardEmailRecipient,
  getEmailRecipient,
  getEmailRecipients,
  updateEmailRecipient,
} from "../src/lib/email-recipient.fn";
import {
  EmailRecipientForwardInput,
  EmailRecipientInput,
} from "../src/models/email-recipient";
import { queryExecutor } from "./query-executor";
import { createMessage } from "./utilities/email-message";
import { createQueue } from "./utilities/email-queue";
import { createRecipient } from "./utilities/email-recipient";
import { createSenderAccount } from "./utilities/sender-account";

describe("Test funciton EmailRecipient", async () => {
  test("Test EmailRecipient create", async () => {
    const message = await createMessage();
    const account = await createSenderAccount();
    const queue = await createQueue(message!.id, account!.id, false);
    const recipient = await createRecipient(queue!.id, "PAUSE");
    expect(recipient).not.toBeUndefined();

    const newRecipientInput: Partial<EmailRecipientInput> = {
      status: "WAITING",
    };
    const updatedRecipient = await updateEmailRecipient(
      queryExecutor,
      recipient!.id,
      newRecipientInput
    );

    expect(updatedRecipient).not.toBeUndefined();
    expect(updatedRecipient?.status).toEqual("WAITING");

    const forwarderInput: EmailRecipientForwardInput = {
      email: "demo@demo.local.lan",
      name: "demo",
      sendingDate: new Date().toISOString(),
      status: "WAITING",
      priority: 1,
      isOwnerReference: true,
    };
    const forwardedRecipient = await forwardEmailRecipient(
      queryExecutor,
      recipient!.id,
      forwarderInput
    );
    expect(forwardedRecipient).not.toBeUndefined();
    expect(forwardedRecipient?.ownerCode).toEqual(recipient?.ownerCode);

    const recipientUpdatedAfterForward = await getEmailRecipient(
      queryExecutor,
      recipient!.id
    );

    expect(recipientUpdatedAfterForward).not.toBeUndefined();
    expect(recipientUpdatedAfterForward?.ownerCode).toBeFalsy();

    forwarderInput.isOwnerReference = false;
    const forwardedRecipientNoOwner = await forwardEmailRecipient(
      queryExecutor,
      forwardedRecipient!.id,
      forwarderInput
    );
    expect(forwardedRecipientNoOwner).not.toBeUndefined();
    expect(forwardedRecipientNoOwner?.ownerCode).toBeFalsy();

    const recipientUpdatedAfterForwardOwner = await getEmailRecipient(
      queryExecutor,
      forwardedRecipient!.id
    );

    expect(recipientUpdatedAfterForwardOwner).not.toBeUndefined();
    expect(recipientUpdatedAfterForwardOwner?.ownerCode).toBeTruthy();

    const connection = await getEmailRecipients(queryExecutor, {
      pagination: { first: 1 },
    });

    expect(connection).not.toBeUndefined();
    expect(connection.totalCount).toBeGreaterThan(0);
    expect(connection.edges.length).toEqual(1);

    const deleteSuccess = await deleteEmailRecipient(
      queryExecutor,
      forwardedRecipient!.id
    );
    expect(deleteSuccess).toBe(true);
  });
});

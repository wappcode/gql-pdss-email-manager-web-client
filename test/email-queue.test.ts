import { gqlparse } from "graphql-client-utilities";
import { describe } from "node:test";
import { expect, test } from "vitest";
import {
  cancelEmailQueue,
  createEmailQueueInputFormEmailQueue,
  deleteCanceledEmailQueueRecipients,
  deleteEmailQueue,
  getEmailQueue,
  getEmailQueues,
  getFragmentEmailQueue,
  updateEmailQueue,
} from "../src/lib/email-queue.fn";
import { queryExecutor } from "./query-executor";
import { createMessage } from "./utilities/email-message";
import { createQueue } from "./utilities/email-queue";
import { createSenderAccount } from "./utilities/sender-account";

describe("Test function EmailQueue", () => {
  test("Test EmailQueue CRUD", async () => {
    const defautFragment = getFragmentEmailQueue();
    const fragment = gqlparse`
      fragment fragmentEmailQueueWithRecipients on EmailQueue {
         ...${defautFragment.operationName}
  
         recipients{
         id
         }
      }
         ${defautFragment.query}
    `;
    const account = await createSenderAccount();
    const message = await createMessage();
    const queue = await createQueue(message!.id, account!.id, true, fragment);
    expect(queue).not.toBeUndefined();
    expect(queue?.recipients.length).toBeGreaterThan(0);

    const queues = await getEmailQueues(queryExecutor);
    expect(queues).not.toBeUndefined();
    expect(queues.totalCount).toBeGreaterThan(0);
    const queue2 = await getEmailQueue(queryExecutor, queue!.id);

    expect(queue2).not.toBeUndefined();
    expect(queue2?.id).not.toBeUndefined();

    const input = createEmailQueueInputFormEmailQueue(queue2!);

    const queue3 = await updateEmailQueue(queryExecutor, queue!.id, input);
    expect(queue3).not.toBeUndefined();
    expect(queue3?.id).not.toBeUndefined();

    // Se crea un nuevo queue sin recipientes para poder eliminarlo
    const queue4 = await createQueue(message!.id, account!.id);
    const deleteSuccess = await deleteEmailQueue(queryExecutor, queue4!.id);
    expect(deleteSuccess).toBe(true);
  });

  test("Remove Canceled Recipients", async () => {
    const defautFragment = getFragmentEmailQueue();
    const fragment = gqlparse`
      fragment fragmentEmailQueueWithRecipients on EmailQueue {
         ...${defautFragment.operationName}
  
         recipients{
         id
         }
      }
         ${defautFragment.query}
    `;
    const account = await createSenderAccount();
    const message = await createMessage();
    const queue = await createQueue(message!.id, account!.id, true, fragment);
    expect(queue).not.toBeUndefined();
    expect(queue?.recipients.length).toBeGreaterThan(0);

    const queuesNoRemove = await deleteCanceledEmailQueueRecipients(
      queryExecutor,
      queue!.id,
      fragment
    );
    expect(queuesNoRemove).not.toBeUndefined();
    expect(queuesNoRemove?.recipients.length).toBeGreaterThan(0);

    const queueRecipientsCanceled = await cancelEmailQueue(
      queryExecutor,
      queue!.id,
      fragment
    );
    expect(queueRecipientsCanceled).not.toBeUndefined();
    expect(queueRecipientsCanceled?.recipients.length).toBeGreaterThan(0);

    const queueRecipientsDeleted = await deleteCanceledEmailQueueRecipients(
      queryExecutor,
      queue!.id,
      fragment
    );
    expect(queueRecipientsDeleted).not.toBeUndefined();
    expect(queueRecipientsDeleted?.recipients.length).toEqual(0);
  });
});

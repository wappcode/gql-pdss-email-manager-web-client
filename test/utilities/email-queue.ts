import { EmailQueueInput } from "../../src/models/email-queue";
import { queryExecutor } from "../query-executor";

import { GQLQueryData } from "graphql-client-utilities";
import { createEmailQueue } from "../../src/lib/email-queue.fn";

export const createQueue = async (
  messageId: string,
  senderAccountId: string,
  addRecipients: boolean = false,
  fragment?: GQLQueryData
) => {
  const input: EmailQueueInput = {
    title: "Demo",
    subject: "Demo",
    replyTo: "Demo@demo.com",
    replyToName: "Demo",
    senderName: "Demo",
    senderAddress: "Demo@demo.com",
    message: messageId,
    senderAccount: senderAccountId,
    recipients: addRecipients
      ? [
          {
            name: "Demo",
            email: "Demo@demo.com",
            params: "Demo",
            sendingDate: "2024-02-23",
            priority: 1,
            ownerCode: "Demo",
          },
        ]
      : undefined,
  };
  const queue = await createEmailQueue(queryExecutor, input, fragment);
  return queue;
};

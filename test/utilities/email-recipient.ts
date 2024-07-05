import {
  EmailRecipientInput,
  EmailRecipientStatus,
} from "../../src/models/email-recipient";
import { queryExecutor } from "../query-executor";

import { createEmailRecipient } from "../../src/lib/email-recipient.fn";

export const createRecipient = (
  queue: string,
  status: EmailRecipientStatus
) => {
  const input: EmailRecipientInput = {
    email: "demo@demo.local.lan",
    name: "demo",
    priority: 1,
    params: "[{key: 'key1', value: 'value1'}]",
    status,
    sendingDate: new Date().toISOString(),
    ownerCode: "abcd",
    queue,
  };
  return createEmailRecipient(queryExecutor, input);
};

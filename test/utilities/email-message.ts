import {
  EmailMessage,
  EmailMessageInput,
} from "../../src/models/email-message";
import { queryExecutor } from "../query-executor";

import { createEmailMessage } from "../../src/lib/email-message.fn";

export const createMessage = async (): Promise<EmailMessage | undefined> => {
  const random = Math.floor(Math.random() * 10000000);
  const input: EmailMessageInput = {
    title: "Demo_" + random,
    body: "Demo_" + random,
    chartset: "UTF-8",
  };
  const message = await createEmailMessage(queryExecutor, input);
  return message;
};

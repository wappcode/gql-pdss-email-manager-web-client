import {
  EmailSenderAccount,
  EmailSenderAccountInput,
} from "../../src/models/email-sender-account";

import { createEmailSenderAccount } from "../../src/lib/email-sender-account.fn";
import { queryExecutor } from "../query-executor";

export const createSenderAccount = async (): Promise<
  EmailSenderAccount | undefined
> => {
  const random = Math.floor(Math.random() * 10000000);
  const input: EmailSenderAccountInput = {
    title: "Demo_" + random,
    email: "demo@demo.local.lan",
    host: "smtp.gmail.com",
    auth: true,
    username: "demo",
    password: "123",
    port: 465,
    maxDeliveriesPerHour: 100,
  };
  const account = await createEmailSenderAccount(queryExecutor, input);
  return account;
};

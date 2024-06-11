import { expect, test } from "vitest";
import {
  createEmailSenderAccountPartialInputFromEmailSenderAccount,
  deleteEmailSenderAccount,
  getEmailSenderAccount,
  getEmailSenderAccounts,
  updateEmailSenderAccount,
} from "../src/lib/email-sender-account.fn";
import { queryExecutor } from "./query-executor";
import { createSenderAccount } from "./utilities/sender-account";

test("Test Sender Account CRUD", async () => {
  const account = await createSenderAccount();
  expect(account).not.toBeUndefined();
  expect(account).not.toBeNull();
  expect(account?.id).not.toBeUndefined();

  const accounts = await getEmailSenderAccounts(queryExecutor);
  expect(accounts.totalCount).toBeGreaterThan(0);

  const account2 = await getEmailSenderAccount(queryExecutor, account!.id);
  expect(account2?.id).toBeTruthy();

  const input = createEmailSenderAccountPartialInputFromEmailSenderAccount(
    account!
  );
  const account3 = await updateEmailSenderAccount(
    queryExecutor,
    account!.id,
    input
  );

  expect(account3).not.toBeUndefined();
  expect(account3?.id).toBeTruthy();

  const deleteSuccess = await deleteEmailSenderAccount(
    queryExecutor,
    account!.id
  );

  expect(deleteSuccess).toBe(true);
});

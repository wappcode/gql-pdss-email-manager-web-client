import { EmailSenderAccount } from "../models/email-sender-account";
import { standardizeEmailEntityModel } from "./standardize-email-entity-model.fn";

export const standardizeEmailSenderAccount = (
  account: EmailSenderAccount
): EmailSenderAccount => {
  const standardizeEntity = standardizeEmailEntityModel(account);
  return standardizeEntity;
};

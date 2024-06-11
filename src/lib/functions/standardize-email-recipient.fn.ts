import { EmailRecipient } from "../../models/email-recipient";
import { standardizeEmailEntityModel } from "./standardize-email-entity-model.fn";

export const standardizeEmailRecipient = (
  recipient: EmailRecipient
): EmailRecipient => {
  const standardizeEntity = standardizeEmailEntityModel(recipient);
  return standardizeEntity;
};

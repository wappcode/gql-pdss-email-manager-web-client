import { EmailRecipient } from "../models/email-recipient";
import {
  standardizeEmailDate,
  standardizeEmailEntityModel,
} from "./standardize-email-entity-model.fn";

export const standardizeEmailRecipient = (
  recipient: EmailRecipient
): EmailRecipient => {
  const standardizeEntity = standardizeEmailEntityModel(recipient);
  const paramsValue = recipient.params;
  if (standardizeEntity.sendingDate) {
    standardizeEntity.sendingDate = standardizeEmailDate(
      standardizeEntity.sendingDate
    )!;
  }
  if (standardizeEntity.viewed) {
    standardizeEntity.viewed = standardizeEmailDate(standardizeEntity.viewed)!;
  }
  if (typeof paramsValue == "string" && (paramsValue as string).length > 0) {
    try {
      standardizeEntity.params = JSON.parse(paramsValue);
    } catch (e) {
      standardizeEntity.params = [];
    }
  } else if (!Array.isArray(paramsValue)) {
    standardizeEntity.params = [];
  }

  return standardizeEntity;
};

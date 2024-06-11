import { EmailMessage } from "../models/email-message";
import { standardizeEmailEntityModel } from "./standardize-email-entity-model.fn";

export const standardizeEmailMessage = (
  message: EmailMessage
): EmailMessage => {
  const standarEntity = standardizeEmailEntityModel(message);
  return standarEntity;
};

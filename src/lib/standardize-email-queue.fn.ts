import { EmailQueue } from "../models/email-queue";
import { standardizeEmailEntityModel } from "./standardize-email-entity-model.fn";

export const standardizeEmailQueue = (queue: EmailQueue): EmailQueue => {
  const standarEntity = standardizeEmailEntityModel(queue);
  return standarEntity;
};

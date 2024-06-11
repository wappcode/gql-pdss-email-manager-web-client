import { EmailEntityModel } from "../models/email-entity-model";

export const standardizeEmailDate = (date?: unknown): Date | undefined => {
  if (date instanceof Date) {
    return date;
  }
  if (typeof date === "string") {
    return new Date(date);
  }
  return undefined;
};

export const standardizeEmailEntityModel = <T extends EmailEntityModel>(
  entity: T
): T => {
  const created = standardizeEmailDate(entity.created)!;
  const updated = standardizeEmailDate(entity.updated)!;
  return {
    ...entity,
    created,
    updated,
  };
};

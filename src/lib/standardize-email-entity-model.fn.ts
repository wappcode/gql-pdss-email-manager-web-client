import { EmailEntityModel } from "../models/email-entity-model";

export const standardizeEmailDate = (date?: unknown): Date | undefined => {
  if (date instanceof Date) {
    return date;
  }
  if (typeof date === "string") {
    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const localedate = `${date}T00:00:00`;
      return new Date(localedate);
    }
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

import { EmailEntityModel } from "./email-entity-model";

export interface EmailMessage extends EmailEntityModel {
  title: string;
  body: string;
  plainTextBody?: string;
  chartset: string;
}

export interface EmailMessageInput {
  title: string;
  body: string;
  plainTextBody?: string;
  chartset: string;
}

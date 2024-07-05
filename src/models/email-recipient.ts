import { EmailEntityModel } from "./email-entity-model";
import { EmailQueue } from "./email-queue";

export type EmailRecipientStatus =
  | "WAITING"
  | "PAUSE"
  | "CANCELED"
  | "SENT"
  | "ERROR";

/**
 * The first string is the key and the second is the value
 * The key must be lowercase and without special characters like tildes or whitespaces instead use an underscore character
 * Expected value example : [ ["key1", "value1"], ["key_2", "value2"] ]
 */
export type EmailRecipientParamType = [string, string];

export const EMAIL_RECIPIENT_PARAM_DELIMITER_START = "|#";
export const EMAIL_RECIPIENT_PARAM_DELIMITER_END = "#|";
// if avobe values are changed, the pattern must be updated
export const EMAIL_RECIPIENT_PARAM_REPLACEMENT_PATTERN =
  "\\|#[a-zA-Z0-9-_\\.]+#\\|";

export interface EmailRecipient extends EmailEntityModel {
  email: string;
  name: string;
  priority: number;
  params: EmailRecipientParamType[];
  status: EmailRecipientStatus;
  sent: boolean;
  sendingDate: Date;
  viewed?: Date;
  ownerCode?: string;
  queue: EmailQueue;
}
export interface EmailRecipientInput {
  email: string;
  name: string;
  priority: number;
  params: string;
  status: EmailRecipientStatus;
  sent: boolean;
  sendingDate: string;
  ownerCode?: string;
  queue: string;
}

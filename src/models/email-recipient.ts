import { EmailEntityModel } from "./email-entity-model";
import { EmailQueue } from "./email-queue";

export type EmailRecipientStatus =
  | "WAITING"
  | "PAUSE"
  | "CANCELED"
  | "SENT"
  | "ERROR";

export interface EmailRecipient<P = unknown> extends EmailEntityModel {
  email: string;
  name: string;
  priority: number;
  params: P;
  status: EmailRecipientStatus;
  sent: boolean;
  sendingDate: Date;
  viewed?: Date;
  ownerCode?: string;
  queue: EmailQueue;
}

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

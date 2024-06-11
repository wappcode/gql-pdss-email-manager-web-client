import { EmailEntityModel } from "./email-entity-model";
import { EmailQueue } from "./email-queue";

export interface EmailSenderAccount extends EmailEntityModel {
  title: string;
  email: string;
  host: string;
  auth: boolean;
  username: string;
  secure?: string;
  port: number;
  maxDeliveriesPerHour: number;
  queues: EmailQueue[];
}
export interface EmailSenderAccountInput {
  title: string;
  email: string;
  host: string;
  auth: boolean;
  username: string;
  password: string;
  secure?: string;
  port: number;
  maxDeliveriesPerHour: number;
}

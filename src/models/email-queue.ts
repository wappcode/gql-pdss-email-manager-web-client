import { EmailEntityModel } from "./email-entity-model";
import { EmailMessage } from "./email-message";
import { EmailRecipient } from "./email-recipient";
import { EmailSenderAccount } from "./email-sender-account";

export interface EmailQueue extends EmailEntityModel {
  title: string;
  subject: string;
  replyTo: string;
  replyToName?: string;
  senderName?: string;
  senderAddress?: string;
  message: EmailMessage;
  senderAccount: EmailSenderAccount;
  recipients: EmailRecipient[];
}
export interface EmailQueueInput {
  title: string;
  subject: string;
  replyTo: string;
  replyToName?: string;
  senderName?: string;
  senderAddress?: string;
  message: string;
  senderAccount: string;
  recipients?: CreateEmailQueueRecipientsInput[];
}
export interface CreateEmailQueueRecipientsInput {
  name: string;
  email: string;
  params?: string;
  sendingDate: string;
  priority?: number;
  ownerCode?: string;
}

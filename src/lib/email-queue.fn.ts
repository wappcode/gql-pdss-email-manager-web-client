import {
  GQLConnection,
  GQLConnectionInput,
  GQLQueryData,
  GQLQueryObject,
  QueryExecutor,
  gqlparse,
  mapConnectionNodesF,
  queryDataToQueryObject,
  throwGQLErrors,
} from "graphql-client-utilities";
import { EmailQueue, EmailQueueInput } from "../models/email-queue";
import { standardizeEmailMessage } from "./standardize-email-message.fn";
import { standardizeEmailQueue } from "./standardize-email-queue.fn";
import { standardizeEmailRecipient } from "./standardize-email-recipient.fn";
import { standardizeEmailSenderAccount } from "./standardize-email-sender-account.fn";

const standardizeForce = (queue: EmailQueue): EmailQueue => {
  const standar = standardizeEmailQueue(queue);
  const recipients = (standar.recipients ?? []).map(standardizeEmailRecipient);
  if (standar.message) {
    standar.message = standardizeEmailMessage(standar.message);
  }
  if (standar.senderAccount) {
    standar.senderAccount = standardizeEmailSenderAccount(
      standar.senderAccount
    );
  }
  if (standar.message) {
    standar.message = standardizeEmailMessage(standar.message);
  }
  return { ...standar, recipients };
};

const standardizeOptional = (queue?: EmailQueue): EmailQueue | undefined => {
  if (!queue) {
    return undefined;
  }
  return standardizeForce(queue);
};

export const getFragmentEmailQueue = (): GQLQueryObject => {
  const fragment = gqlparse`

    fragment fragmentEmailQueue on EmailQueue {
            id
            title
            subject
            replyTo
            replyToName
            senderName
            senderAddress
    				senderAccount{
              id
              title
            }
            message{
              id
              title
            }
            created
            updated
        }

    `;
  return fragment;
};

export const getEmailQueues = (
  queryExecutor: QueryExecutor,
  input?: GQLConnectionInput,
  fragment?: GQLQueryData
): Promise<GQLConnection<EmailQueue>> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getFragmentEmailQueue();

  const query = gqlparse`

        query QueryGetEmailQueues($input: ConnectionInput) {
            connection: getEmailQueues(input: $input) {
            totalCount
            pageInfo {
             hasNextPage
             hasPreviousPage
             startCursor
             endCursor
            }
             
                edges {
                cursor
                node {
                   ...${finalFragment.operationName}
                }
                
                  }
            }
        }
            ${finalFragment.query}
            `;

  return queryExecutor<{ connection: GQLConnection<EmailQueue> }>(query, {
    input,
  })
    .then(throwGQLErrors)
    .then((result) => result.data.connection)
    .then(mapConnectionNodesF(standardizeForce));
};

export const getEmailQueue = (
  queryExecutor: QueryExecutor,
  id: string,
  fragment?: GQLQueryData
): Promise<EmailQueue | undefined> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getFragmentEmailQueue();

  const query = gqlparse`

        query QueryGetEmailQueue($id: ID!) {
            queue: getEmailQueue(id: $id) {
               ...${finalFragment.operationName}
            }
        }
            ${finalFragment.query}
            `;
  return queryExecutor<{ queue: EmailQueue | undefined }>(query, {
    id,
  })
    .then(throwGQLErrors)
    .then((result) => result.data.queue)
    .then(standardizeOptional);
};

export const createEmailQueue = (
  queryExecutor: QueryExecutor,
  input: EmailQueueInput,
  fragment?: GQLQueryData
): Promise<EmailQueue | undefined> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getFragmentEmailQueue();

  const query = gqlparse`

        mutation MutationCreateEmailQueue($input: EmailQueueInput!) {
            queue: createEmailQueue(input: $input) {
               ...${finalFragment.operationName}
            }
        }
        ${finalFragment.query}
        `;
  return queryExecutor<{ queue: EmailQueue | undefined }>(query, {
    input,
  })
    .then(throwGQLErrors)
    .then((result) => result.data.queue)
    .then(standardizeOptional);
};

export const updateEmailQueue = (
  queryExecutor: QueryExecutor,
  id: string,
  input: Partial<EmailQueueInput>,
  fragment?: GQLQueryData
): Promise<EmailQueue | undefined> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getFragmentEmailQueue();

  const query = gqlparse`

        mutation MutationUpdateEmailQueue($id: ID!, $input: EmailQueuePartialInput!) {
            queue: updateEmailQueue(id: $id, input: $input) {
               ...${finalFragment.operationName}
            }
    }
            ${finalFragment.query}
            `;
  return queryExecutor<{ queue: EmailQueue | undefined }>(query, { id, input })
    .then(throwGQLErrors)
    .then((result) => result.data.queue)
    .then(standardizeOptional);
};

export const deleteEmailQueue = (
  queryExecutor: QueryExecutor,
  id: string
): Promise<boolean> => {
  const query = gqlparse`

        mutation MutationDeleteEmailQueue($id: ID!) {
            success: deleteEmailQueue(id: $id)
        }
        `;
  return queryExecutor<{ success: boolean }>(query, { id })
    .then(throwGQLErrors)
    .then((result) => result.data.success);
};

/**
 * Cancela a los elementos de una lista solo aplica a los que estan en estatus PAUSE y WAITING
 * @param queryExecutor
 * @param id
 * @returns
 */
export const cancelEmailQueue = (
  queryExecutor: QueryExecutor,
  id: string,
  fragment?: GQLQueryData
): Promise<EmailQueue | undefined> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getFragmentEmailQueue();

  const query = gqlparse`

        mutation MutationCancelEmailQueue($id: ID!) {
            queue: cancelEmailQueue(id: $id){
              ...${finalFragment.operationName}
            }
            }
            ${finalFragment.query}
        `;
  return queryExecutor<{ queue: EmailQueue | undefined }>(query, { id })
    .then(throwGQLErrors)
    .then((result) => result.data.queue)
    .then(standardizeOptional);
};
/**
 * Activa o pone estatus WAITING a los elementos de una lista solo aplica a los que estan en estatus PAUSE
 * @param queryExecutor
 * @param id
 * @returns
 */
export const resumeEmailQueue = (
  queryExecutor: QueryExecutor,
  id: string,
  fragment?: GQLQueryData
): Promise<EmailQueue | undefined> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getFragmentEmailQueue();

  const query = gqlparse`

        mutation MutationResumeEmailQueue($id: ID!) {
            queue: resumeEmailQueue(id: $id){
              ...${finalFragment.operationName}
            }
            }
            ${finalFragment.query}
        `;
  return queryExecutor<{ queue: EmailQueue | undefined }>(query, { id })
    .then(throwGQLErrors)
    .then((result) => result.data.queue)
    .then(standardizeOptional);
};
/**
 * Pausa los elmentos de una lista solo aplica a los que estan en estatus WAITING
 * @param queryExecutor
 * @param id
 * @returns
 */
export const pauseEmailQueue = (
  queryExecutor: QueryExecutor,
  id: string,
  fragment?: GQLQueryData
): Promise<EmailQueue | undefined> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getFragmentEmailQueue();

  const query = gqlparse`

        mutation MutationPauseEmailQueue($id: ID!) {
            queue: pauseEmailQueue(id: $id){
              ...${finalFragment.operationName}
            }
            }
            ${finalFragment.query}
        `;
  return queryExecutor<{ queue: EmailQueue | undefined }>(query, { id })
    .then(throwGQLErrors)
    .then((result) => result.data.queue)
    .then(standardizeOptional);
};

export const deleteCanceledEmailQueueRecipients = (
  queryExecutor: QueryExecutor,
  id: string,
  fragment?: GQLQueryData
): Promise<EmailQueue | undefined> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getFragmentEmailQueue();
  const query = gqlparse`

        mutation MutationDeleteCanceledEmailQueueRecipients($id: ID!) {
            queue: deleteCanceledEmailQueueRecipients(id: $id){
              ...${finalFragment.operationName}
          }
        }
    ${finalFragment.query}
  `;
  return queryExecutor<{ queue: EmailQueue | undefined }>(query, { id })
    .then(throwGQLErrors)
    .then((result) => result.data.queue)
    .then(standardizeOptional);
};

export const createEmailQueueInputFormEmailQueue = (queue: EmailQueue) => {
  const input: Partial<EmailQueueInput> = {
    title: queue.title,
    subject: queue.subject,
    replyTo: queue.replyTo,
    replyToName: queue.replyToName,
    senderName: queue.senderName,
    senderAddress: queue.senderAddress,
    message: queue.message.id,
    senderAccount: queue.senderAccount.id,
  };
  return input;
};

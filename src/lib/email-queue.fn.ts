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
import { standardizeEmailQueue } from "./standardize-email-queue.fn";

const standardizeForce = (queue: EmailQueue): EmailQueue => {
  const standar = standardizeEmailQueue(queue);
  return standar;
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
            queue: deleteEmailQueue(id: $id)
        }
        `;
  return queryExecutor<{ queue: boolean }>(query, { id })
    .then(throwGQLErrors)
    .then((result) => result.data.queue);
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

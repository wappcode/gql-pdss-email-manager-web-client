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
import { EmailMessage, EmailMessageInput } from "../models/email-message";
import { standardizeEmailMessage } from "./standardize-email-message.fn";

const standardizeForced = (message: EmailMessage): EmailMessage => {
  const standar = standardizeEmailMessage(message);
  return standar;
};
const standardizeOptional = (
  message?: EmailMessage
): EmailMessage | undefined => {
  if (!message) {
    return undefined;
  }
  const standar = standardizeForced(message);
  return standar;
};

export const getFragmentEmailMessage = (): GQLQueryObject => {
  const fragment = gqlparse`

        fragment fragmentEmailMessage on EmailMessage {
            title
            body
            plainTextBody
            chartset
        }

    `;
  return fragment;
};

export const getEmailMessages = (
  queryExecutor: QueryExecutor,
  input?: GQLConnectionInput,
  fragment?: GQLQueryData
): Promise<GQLConnection<EmailMessage>> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getFragmentEmailMessage();

  const query = gqlparse`

        query QueryGetEmailMessages($input: ConnectionInput) {
            connection: getEmailMessages(input: $input) {
            totalCount
            pageInfo {
             hasNextPage
             hasPreviousPage
             startCursor
             endCursor
            }
            edges {
                ...${finalFragment.operationName}
                }
            }
        }
            ${finalFragment.query}
        `;

  return queryExecutor<{ connection: GQLConnection<EmailMessage> }>(query, {
    input,
  })
    .then(throwGQLErrors)
    .then((result) => result.data.connection)
    .then(mapConnectionNodesF(standardizeForced));
};

export const getEmailMessage = (
  queryExecutor: QueryExecutor,
  id: string,
  fragment?: GQLQueryData
): Promise<EmailMessage | undefined> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getFragmentEmailMessage();

  const query = gqlparse`

        query QueryGetEmailMessage($id: ID!) {
            message: getEmailMessage(id: $id) {
               ...${finalFragment.operationName}
            }
        }
        ${finalFragment.query}
        `;
  return queryExecutor<{ message: EmailMessage | undefined }>(query, {
    id,
  })
    .then(throwGQLErrors)
    .then((result) => result.data.message)
    .then(standardizeOptional);
};

export const createEmailMessage = (
  queryExecutor: QueryExecutor,
  input: EmailMessageInput,
  fragment?: GQLQueryData
): Promise<EmailMessage | undefined> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getFragmentEmailMessage();

  const query = gqlparse`

        mutation MutationCreateEmailMessage($input: EmailMessageInput!) {
            message: createEmailMessage(input: $input) {
               ...${finalFragment.operationName}
            }
        }
        ${finalFragment.query}
        `;
  return queryExecutor<{ message: EmailMessage | undefined }>(query, {
    input,
  })
    .then(throwGQLErrors)
    .then((result) => result.data.message)
    .then(standardizeOptional);
};

export const updateEmailMessage = (
  queryExecutor: QueryExecutor,
  id: string,
  input: Partial<EmailMessageInput>,
  fragment?: GQLQueryData
): Promise<EmailMessage | undefined> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getFragmentEmailMessage();

  const query = gqlparse`

        mutation MutationUpdateEmailMessage($id: ID!, $input: EmailMessagePartialInput!) {
            message: updateEmailMessage(id: $id, input: $input) {
               ...${finalFragment.operationName}
            }
        }
        ${finalFragment.query}
        `;
  return queryExecutor<{ message: EmailMessage | undefined }>(query, {
    input,
    id,
  })
    .then(throwGQLErrors)
    .then((result) => result.data.message)
    .then(standardizeOptional);
};

export const deleteEmailMessage = (
  queryExecutor: QueryExecutor,
  id: string
): Promise<boolean> => {
  const query = gqlparse`

        mutation MutationDeleteEmailMessage($id: ID!) {
            success: deleteEmailMessage(id: $id)
        }
        `;
  return queryExecutor<{ success: boolean }>(query, {
    id,
  })
    .then(throwGQLErrors)
    .then((result) => result.data.success);
};

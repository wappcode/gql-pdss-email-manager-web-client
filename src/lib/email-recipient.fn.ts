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
import { EmailRecipient, EmailRecipientInput } from "../models/email-recipient";
import { standardizeEmailRecipient } from "./standardize-email-recipient.fn";

const standardizeForced = (recipient: EmailRecipient): EmailRecipient => {
  const standardized = standardizeEmailRecipient(recipient);
  return standardized;
};

const standardizeOptional = (
  recipient?: EmailRecipient
): EmailRecipient | undefined => {
  if (!recipient) return undefined;
  return standardizeForced(recipient);
};

export const getFragmentEmailRecipient = (): GQLQueryObject => {
  const fragment = gqlparse`

        fragment fragmentEmailRecipient on EmailRecipient {
        id
        email
        name
        priority
        params
        status
        sent
        sendingDate
        viewed
        ownerCode
        queue{
        id
        title
        }
        created
        updated
        }`;
  return fragment;
};

export const getEmailRecipients = (
  queryExecutor: QueryExecutor,
  input?: GQLConnectionInput,
  fragment?: GQLQueryData
): Promise<GQLConnection<EmailRecipient>> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getFragmentEmailRecipient();

  const query = gqlparse`
        query QueryGetEmailRecipients($input: ConnectionInput) {
                connection: getEmailRecipients(input: $input) {
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
        ${finalFragment.query}`;

  return queryExecutor<{ connection: GQLConnection<EmailRecipient> }>(query, {
    input,
  })
    .then(throwGQLErrors)
    .then((result) => result.data.connection)
    .then(mapConnectionNodesF(standardizeForced));
};

export const getEmailRecipient = (
  queryExecutor: QueryExecutor,
  id: string,
  fragment?: GQLQueryData
): Promise<EmailRecipient | undefined> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getFragmentEmailRecipient();

  const query = gqlparse`

        query QueryGetEmailRecipient($id: ID!) {
            recipient: getEmailRecipient(id: $id) {
               ...${finalFragment.operationName}
            }
        }
            ${finalFragment.query}
        `;
  return queryExecutor<{ recipient: EmailRecipient | undefined }>(query, {
    id,
  })
    .then(throwGQLErrors)
    .then((result) => result.data.recipient)
    .then(standardizeOptional);
};

export const createEmailRecipient = (
  queryExecutor: QueryExecutor,
  input: EmailRecipientInput,
  fragment?: GQLQueryData
): Promise<EmailRecipient | undefined> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getFragmentEmailRecipient();

  const query = gqlparse`

        mutation MutationCreateEmailRecipient($input: EmailRecipientInput!) {
            recipient: createEmailRecipient(input: $input) {
               ...${finalFragment.operationName}
            }
        }
        ${finalFragment.query}
        `;
  return queryExecutor<{ recipient: EmailRecipient | undefined }>(query, {
    input,
  })
    .then(throwGQLErrors)
    .then((result) => result.data.recipient)
    .then(standardizeOptional);
};

export const updateEmailRecipient = (
  queryExecutor: QueryExecutor,
  id: string,
  input: Partial<EmailRecipientInput>,
  fragment?: GQLQueryData
): Promise<EmailRecipient | undefined> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getFragmentEmailRecipient();

  const query = gqlparse`

        mutation MutationUpdateEmailRecipient($id: ID!, $input: EmailRecipientPartialInput!) {
            recipient: updateEmailRecipient(id: $id, input: $input) {
               ...${finalFragment.operationName}
            }
        }
        ${finalFragment.query}
        `;
  return queryExecutor<{ recipient: EmailRecipient | undefined }>(query, {
    input,
    id,
  })
    .then(throwGQLErrors)
    .then((result) => result.data.recipient)
    .then(standardizeOptional);
};

export const deleteEmailRecipient = (
  queryExecutor: QueryExecutor,
  id: string
): Promise<boolean> => {
  const query = gqlparse`

        mutation MutationDeleteEmailRecipient($id: ID!) {
            success: deleteEmailRecipient(id: $id)
        }
        `;
  return queryExecutor<{ success: boolean }>(query, { id })
    .then(throwGQLErrors)
    .then((result) => result.data.success);
};

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
import {
  EmailSenderAccount,
  EmailSenderAccountInput,
} from "../models/email-sender-account";
import { standardizeEmailSenderAccount } from "./standardize-email-sender-account.fn";

const standardizeForced = (account: EmailSenderAccount): EmailSenderAccount => {
  const standardized = standardizeEmailSenderAccount(account);
  return standardized;
};

const standardizeOptional = (
  account?: EmailSenderAccount
): EmailSenderAccount | undefined => {
  if (!account) return undefined;
  return standardizeForced(account);
};

export const getFragmentEmailSenderAccount = (): GQLQueryObject => {
  const fragment = gqlparse`
    fragment fragmentEmailSenderAccount on EmailSenderAccount {
        id
        title
        email
        host
        auth
        username
        secure
        port
        maxDeliveriesPerHour
        created 
        updated
    }
    `;
  return fragment;
};

export const getEmailSenderAccounts = (
  queryExecutor: QueryExecutor,
  input?: GQLConnectionInput,
  fragment?: GQLQueryData
): Promise<GQLConnection<EmailSenderAccount>> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getFragmentEmailSenderAccount();

  const query = gqlparse`

        query QueryGetEmailSenderAccounts($input: ConnectionInput) {
            connection: getEmailSenderAccounts(input: $input) {
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

  return queryExecutor<{ connection: GQLConnection<EmailSenderAccount> }>(
    query,
    {
      input,
    }
  )
    .then(throwGQLErrors)
    .then((result) => result.data.connection)
    .then(mapConnectionNodesF(standardizeForced));
};

export const getEmailSenderAccount = (
  queryExecutor: QueryExecutor,
  id: string,
  fragment?: GQLQueryData
): Promise<EmailSenderAccount | undefined> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getFragmentEmailSenderAccount();

  const query = gqlparse`

        query QueryGetEmailSenderAccount($id: ID!) {
            account: getEmailSenderAccount(id: $id) {
               ...${finalFragment.operationName}
            }
        }
            ${finalFragment.query}
        `;
  return queryExecutor<{ account: EmailSenderAccount | undefined }>(query, {
    id,
  })
    .then(throwGQLErrors)
    .then((result) => result.data.account)
    .then(standardizeOptional);
};

export const createEmailSenderAccount = (
  queryExecutor: QueryExecutor,
  input: EmailSenderAccountInput,
  fragment?: GQLQueryData
): Promise<EmailSenderAccount | undefined> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getFragmentEmailSenderAccount();

  const query = gqlparse`

        mutation MutationCreateEmailSenderAccount($input: EmailSenderAccountInput!) {
            account: createEmailSenderAccount(input: $input) {
               ...${finalFragment.operationName}
            }
        }
        ${finalFragment.query}
        `;
  return queryExecutor<{ account: EmailSenderAccount | undefined }>(query, {
    input,
  })
    .then(throwGQLErrors)
    .then((result) => result.data.account)
    .then(standardizeOptional);
};

export const updateEmailSenderAccount = (
  queryExecutor: QueryExecutor,
  id: string,
  input: Partial<EmailSenderAccountInput>,
  fragment?: GQLQueryData
): Promise<EmailSenderAccount | undefined> => {
  const finalFragment = fragment
    ? queryDataToQueryObject(fragment)
    : getFragmentEmailSenderAccount();

  const query = gqlparse`

        mutation MutationUpdateEmailSenderAccount($id: ID!, $input: EmailSenderAccountPartialInput!) {
            account: updateEmailSenderAccount(id: $id, input: $input) {
               ...${finalFragment.operationName}
            }
        }
        ${finalFragment.query}
        `;
  return queryExecutor<{ account: EmailSenderAccount | undefined }>(query, {
    id,
    input,
  })
    .then(throwGQLErrors)
    .then((result) => result.data.account)
    .then(standardizeOptional);
};

export const deleteEmailSenderAccount = (
  queryExecutor: QueryExecutor,
  id: string
): Promise<boolean> => {
  const query = gqlparse`

        mutation MutationDeleteEmailSenderAccount($id: ID!) {
            success: deleteEmailSenderAccount(id: $id)
        }
        `;
  return queryExecutor<{ success: boolean }>(query, { id })
    .then(throwGQLErrors)
    .then((result) => result.data.success);
};

export const createEmailSenderAccountPartialInputFromEmailSenderAccount = (
  senderAccount: EmailSenderAccount
): Partial<EmailSenderAccountInput> => {
  const input: Partial<EmailSenderAccountInput> = {
    title: senderAccount.title,
    email: senderAccount.email,
    host: senderAccount.host,
    auth: senderAccount.auth,
    username: senderAccount.username,
    secure: senderAccount.secure,
    port: senderAccount.port,
    maxDeliveriesPerHour: senderAccount.maxDeliveriesPerHour,
  };
  return input;
};

import { gql } from '@apollo/client'

export const CreateAccount = gql`
  mutation CreateAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      accountId
      success
      errors
    }
  }
`

export const DeleteAccount = gql`
  mutation DeleteAccount($accountId: ID!) {
    deleteAccount(accountId: $accountId) {
      success
      errors
    }
  }
`

export const UpdateAccount = gql`
  mutation UpdateAccount($accountId: ID!, $input: UpdateAccountInput!) {
    updateAccount(accountId: $accountId, input: $input) {
      success
      errors
    }
  }
`

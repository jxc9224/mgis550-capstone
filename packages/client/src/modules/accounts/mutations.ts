/**
 * @author John Carr <jxc9224@rit.edu>
 * @license MIT
 */

import { gql } from '@apollo/client'

export const CreateAccount = gql`
  mutation CreateAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      accountId
      success
    }
  }
`

export const DeleteAccount = gql`
  mutation DeleteAccount($accountId: ID!) {
    deleteAccount(accountId: $accountId) {
      success
    }
  }
`

export const UpdateAccount = gql`
  mutation UpdateAccount($accountId: ID!, $input: UpdateAccountInput!) {
    updateAccount(accountId: $accountId, input: $input) {
      success
    }
  }
`

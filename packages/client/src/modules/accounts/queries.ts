/**
 * @author John Carr <jxc9224@rit.edu>
 * @license MIT
 */

import { gql } from '@apollo/client'

export const FindAllAccounts = gql`
  query FindAllAccounts {
    findAllAccounts {
      accountId
      name
      phone
      addressLine1
      addressLine2
      country
      state
      city
      zip
    }
  }
`

export const FindAllAccountsMatchName = gql`
  query FindAllAccountsMatchName($name: String!) {
    findAllAccountsMatchName(name: $name) {
      accountId
      name
      phone
      addressLine1
      addressLine2
      country
      state
      city
      zip
    }
  }
`

export const FindFirstAccountMatchName = gql`
  query FindFirstAccountMatchName($name: String!) {
    findFirstAccountMatchName(name: $name) {
      accountId
      name
      phone
      addressLine1
      addressLine2
      country
      state
      city
      zip
    }
  }
`

export const FindAccountById = gql`
  query FindAccountById($accountId: ID!) {
    findAccountById(accountId: $accountId) {
      accountId
      name
      phone
      addressLine1
      addressLine2
      country
      state
      city
      zip
    }
  }
`

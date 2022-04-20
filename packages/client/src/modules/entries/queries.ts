/**
 * @author John Carr <jxc9224@rit.edu>
 * @license MIT
 */

import { gql } from '@apollo/client'

export const FindAllDataEntries = gql`
  query FindAllDataEntries {
    findAllDataEntries {
      entryId
      lifeCycleState
      serialNumber
      productId
      donorAccountId
      recipientAccountId
    }
  }
`

export const FindAllDataEntriesInGridFormat = gql`
  query FindAllDataEntriesInGridFormat {
    findAllDataEntriesInGridFormat {
      entryId
      lifeCycleState
      serialNumber
      modified
      productName
      manufacturer
      model
      donorAccount
      recipientAccount
    }
  }
`

export const FindDataEntryById = gql`
  query FindDataEntryById($entryId: ID!) {
    findDataEntryById(entryId: $entryId) {
      entryId
      lifeCycleState
      serialNumber
      productId
      donorAccountId
      recipientAccountId
    }
  }
`

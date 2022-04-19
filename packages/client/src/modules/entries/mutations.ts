import { gql } from '@apollo/client'

export const CreateDataEntry = gql`
  mutation CreateDataEntry($input: CreateDataEntryInput!) {
    createDataEntry(input: $input) {
      success
      errors
    }
  }
`

export const DeleteDataEntry = gql`
  mutation DeleteDataEntry($entryId: ID!) {
    deleteDataEntry(entryId: $entryId) {
      success
      errors
    }
  }
`

export const UpdateDataEntry = gql`
  mutation UpdateDataEntry($entryId: ID!, $input: UpdateDataEntryInput!) {
    updateDataEntry(entryId: $entryId, input: $input) {
      success
      errors
    }
  }
`

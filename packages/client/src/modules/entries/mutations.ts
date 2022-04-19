import { gql } from '@apollo/client'

export const CreateDataEntry = gql`
  mutation CreateDataEntry($input: CreateDataEntryInput!) {
    createDataEntry(input: $input) {
      success
    }
  }
`

export const DeleteDataEntry = gql`
  mutation DeleteDataEntry($entryId: ID!) {
    deleteDataEntry(entryId: $entryId) {
      success
    }
  }
`

export const UpdateDataEntry = gql`
  mutation UpdateDataEntry($entryId: ID!, $input: UpdateDataEntryInput!) {
    updateDataEntry(entryId: $entryId, input: $input) {
      success
    }
  }
`

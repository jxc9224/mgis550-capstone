import { gql } from '@apollo/client'

export const CreateProduct = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      productId
      success
      errors
    }
  }
`

export const DeleteProduct = gql`
  mutation DeleteProduct($productId: ID!) {
    deleteProduct(productId: $productId) {
      success
      errors
    }
  }
`

export const UpdateProduct = gql`
  mutation UpdateProduct($productId: ID!, $input: UpdateProductInput!) {
    updateProduct(productId: $productId, input: $input) {
      success
      errors
    }
  }
`

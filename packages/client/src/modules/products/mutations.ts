/**
 * @author John Carr <jxc9224@rit.edu>
 * @license MIT
 */

import { gql } from '@apollo/client'

export const CreateProduct = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      productId
      success
    }
  }
`

export const DeleteProduct = gql`
  mutation DeleteProduct($productId: ID!) {
    deleteProduct(productId: $productId) {
      success
    }
  }
`

export const UpdateProduct = gql`
  mutation UpdateProduct($productId: ID!, $input: UpdateProductInput!) {
    updateProduct(productId: $productId, input: $input) {
      success
    }
  }
`

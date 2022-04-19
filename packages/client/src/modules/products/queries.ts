import { gql } from '@apollo/client'

export const FindAllProducts = gql`
  query FindAllProducts {
    findAllProducts {
      productId
      productName
      manufacturer
      model
    }
  }
`

export const FindAllProductsInGridFormat = gql`
  query FindAllProductsInGridFormat {
    findAllProductsInGridFormat {
      productId
      productName
      manufacturer
      model
    }
  }
`

export const FindAllProductsMatchModel = gql`
  query FindAllProductsMatchModel($model: String!) {
    findAllProductsMatchModel(model: $model) {
      productId
      productName
      manufacturer
      model
    }
  }
`

export const FindFirstProductMatchModel = gql`
  query FindFirstProductMatchModel($model: String!) {
    findFirstProductMatchModel(model: $model) {
      productId
      productName
      manufacturer
      model
    }
  }
`

export const FindProductById = gql`
  query FindProductById($entryId: ID!) {
    findProductById(entryId: $entryId) {
      productId
      productName
      manufacturer
      model
    }
  }
`

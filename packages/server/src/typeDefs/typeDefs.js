/**
 * @author John Carr <jxc9224@rit.edu>
 * @license MIT
 */

import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  scalar DateTime

  type Query {
    findAllAccounts: [Account]
    findAllDataEntries: [DataEntry]
    findAllProducts: [Product]
    findAllUsers: [User]

    findProductById(productId: ID!): Product
    findAccountById(accountId: ID!): Account
    findDataEntryById(entryId: ID!): DataEntry
    findUserById(userId: ID!): User

    findFirstUserMatchEmail(email: String!): User
    findUserUsingLogin(email: String!, password: String!): User

    findAllDataEntriesInGridFormat: [DataGridRow]

    findAllProductsMatchName(productName: String!): [Product]
    findAllProductsMatchManufacturer(productName: String!): [Product]
    findAllProductsMatchModel(model: String!): [Product]

    findFirstProductMatchName(productName: String!): Product
    findFirstProductMatchManufacturer(productName: String!): Product
    findFirstProductMatchModel(model: String!): Product

    findAllAccountsMatchName(name: String!): [Account]
    findFirstAccountMatchName(name: String!): Account
  }

  type Error {
    message: String
    path: String
  }

  type BaseResponse {
    success: String
    errors: [Error]
  }

  type Mutation {
    createUser(input: CreateUserInput!): BaseResponse
    updateUser(userId: ID!, input: UpdateUserInput!): BaseResponse
    deleteUser(userId: ID!): BaseResponse

    createDataEntry(input: CreateDataEntryInput!): BaseResponse
    updateDataEntry(entryId: ID!, input: UpdateDataEntryInput!): BaseResponse
    deleteDataEntry(entryId: ID!): BaseResponse

    createProduct(input: CreateProductInput!): CreateProductResponse
    updateProduct(productId: ID!, input: UpdateProductInput!): BaseResponse
    deleteProduct(productId: ID!): BaseResponse

    createAccount(input: CreateAccountInput!): CreateAccountResponse
    updateAccount(accountId: ID!, input: UpdateAccountInput!): BaseResponse
    deleteAccount(accountId: ID!): BaseResponse
  }

  type User {
    userId: ID!
    email: String!
    password: String!
    isAdministrator: Boolean!
  }

  input CreateUserInput {
    email: String!
    password: String!
    isAdministrator: Boolean
  }

  input UpdateUserInput {
    email: String
    password: String
    isAdministrator: Boolean
  }

  enum LifeCycleState {
    DISTRIBUTED
    EWASTE
    PENDING
    PROBLEM
    RECEIVED
  }

  type DataGridRow {
    entryId: ID!
    lifeCycleState: LifeCycleState!
    serialNumber: String!
    modified: DateTime!
    productName: String!
    manufacturer: String!
    model: String!
    donorAccount: String!
    recipientAccount: String!
  }

  type DataEntry {
    entryId: ID!
    lifeCycleState: LifeCycleState!
    serialNumber: String!
    modified: DateTime!
    productId: ID!
    donorAccountId: ID!
    recipientAccountId: ID!
  }

  input CreateDataEntryInput {
    lifeCycleState: LifeCycleState!
    serialNumber: String!
    modified: DateTime!
    productId: ID!
    donorAccountId: ID!
    recipientAccountId: ID!
  }

  input UpdateDataEntryInput {
    lifeCycleState: LifeCycleState
    serialNumber: String
    modified: DateTime
    productId: ID
    donorAccountId: ID
    recipientAccountId: ID
  }

  type Product {
    productId: ID!
    productName: String!
    manufacturer: String!
    model: String!
  }

  input CreateProductInput {
    productName: String!
    manufacturer: String!
    model: String!
  }

  type CreateProductResponse {
    productId: ID
    success: String
    errors: [Error]
  }

  input UpdateProductInput {
    productName: String
    manufacturer: String
    model: String
  }

  type Account {
    accountId: ID!
    name: String!
    phone: String!
    addressLine1: String!
    addressLine2: String
    country: String!
    state: String!
    city: String!
    zip: String!
  }

  input CreateAccountInput {
    name: String!
    phone: String!
    addressLine1: String!
    addressLine2: String
    country: String!
    state: String!
    city: String!
    zip: String!
  }

  type CreateAccountResponse {
    accountId: ID
    success: String
    errors: [Error]
  }

  input UpdateAccountInput {
    name: String
    phone: String
    addressLine1: String
    addressLine2: String
    country: String
    state: String
    city: String
    zip: String
  }
`
export default typeDefs

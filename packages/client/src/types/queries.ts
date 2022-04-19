import { LifeCycleState } from './shared'

export interface Account {
  accountId?: number
  name: string
  phone: string
  addressLine1: string
  addressLine2?: string
  country: string
  state: string
  city: string
  zip: string
}

export interface FindAllAccountsResult {
  findAllAccounts: Account[]
}

export interface FindAllAccountsMatchNameResult {
  findAllAccountsMatchName: Account[]
}

export interface DataEntry {
  entryId?: number
  lifeCycleState: LifeCycleState
  serialNumber: string
  modified: Date
  productId: number
  donorAccountId: number
  recipientAccountId: number
}

export interface FindDataEntryByIdResult {
  findDataEntryById: DataEntry
}

export interface FindAllDataEntriesResult {
  findAllDataEntries: DataEntry[]
}

export interface DataGridRow {
  entryId: number
  lifeCycleState: string
  serialNumber: string
  modified: string
  productName: string
  manufacturer: string
  model: string
  donorAccount: string
  recipientAccount: string
}

export interface FindAllDataEntriesInGridFormatResult {
  findAllDataEntriesInGridFormat: DataGridRow[]
}

export interface Product {
  productId?: number
  productName: string
  manufacturer: string
  model: string
}

export interface FindAllProductsResult {
  findAllProducts: Product[]
}

export interface FindAllProductsMatchModelResult {
  findAllProductsMatchModel: Product[]
}

export interface FindFirstProductMatchModelResult {
  findFirstProductMatchModel: Product
}

export interface User {
  userId: number
  email: string
  password: string
  isAdministrator: boolean
}

export interface FindUserUsingLoginResult {
  findUserUsingLogin: User
}

export interface FindFirstUserMatchEmailResult {
  findFirstUserMatchEmail: User
}

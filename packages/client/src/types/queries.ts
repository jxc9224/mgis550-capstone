/**
 * @author John Carr <jxc9224@rit.edu>
 * @license MIT
 */

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

export interface AccountQueryRow extends Account {
  accountId: number
}

export interface FindAllAccountsResult {
  findAllAccounts: AccountQueryRow[]
}

export interface FindFirstAccountMatchNameResult {
  findFirstAccountMatchName: AccountQueryRow
}

export interface FindAllAccountsMatchNameResult {
  findAllAccountsMatchName: AccountQueryRow[]
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

export interface DataEntryQueryRow extends DataEntry {
  entryId: number
}

export interface FindDataEntryByIdResult {
  findDataEntryById: DataEntryQueryRow
}

export interface FindAllDataEntriesResult {
  findAllDataEntries: DataEntryQueryRow[]
}

export interface DataGridRow
  extends Omit<
    DataEntry,
    'modified' | 'productId' | 'donorAccountId' | 'recipientAccountId'
  > {
  entryId: number
  modified: string
  productName: string
  manufacturer: string
  model: string
  donorAccount: string
  recipientAccount: string
}

export interface DataGridModelRow extends Omit<DataGridRow, 'entryId'> {
  id: number
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

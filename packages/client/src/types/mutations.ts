import { LifeCycleState } from './shared'

export interface BaseResponseError {
  message: string
  path: string
}

export interface BaseResponse {
  success: string
  errors?: BaseResponseError[]
}

export interface CreateAccountInput {
  name: string
  phone: string
  addressLine1: string
  addressLine2?: string
  country: string
  state: string
  city: string
  zip: string
}

export interface CreateAccountResponse {
  accountId: number
  success: string
  errors?: BaseResponseError[]
}

export interface CreateDataEntryInput {
  lifeCycleState: LifeCycleState
  serialNumber: string
  modified: Date
  productId: number
  donorAccountId: number
  recipientAccountId: number
}

export interface CreateProductInput {
  productName: string
  manufacturer: string
  model: string
}

export interface CreateProductResponse {
  productId: number
  success: string
  errors?: BaseResponseError[]
}

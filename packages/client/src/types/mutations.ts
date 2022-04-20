/**
 * @author John Carr <jxc9224@rit.edu>
 * @license MIT
 */

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
  input: {
    name: string
    phone: string
    addressLine1: string
    addressLine2?: string
    country: string
    state: string
    city: string
    zip: string
  }
}

export interface CreateAccountResponse {
  createAccount?: {
    accountId: number
    success: string
    errors?: BaseResponseError[]
  }
}

export interface CreateDataEntryInput {
  input: {
    lifeCycleState: LifeCycleState
    serialNumber: string
    modified: Date
    productId: number
    donorAccountId: number
    recipientAccountId: number
  }
}

export interface CreateDataEntryResponse {
  createDataEntry?: BaseResponse
}

export interface CreateProductInput {
  input: {
    productName: string
    manufacturer: string
    model: string
  }
}

export interface CreateProductResponse {
  createProduct?: {
    productId: number
    success: string
    errors?: BaseResponseError[]
  }
}

export interface UpdateDataEntryInput {
  entryId: number
  input: {
    lifeCycleState?: LifeCycleState
    serialNumber?: string
    modified?: Date
    productId?: number
    donorAccountId?: number
    recipientAccountId?: number
  }
}

export interface UpdateDataEntryResponse {
  createDataEntry?: BaseResponse
}

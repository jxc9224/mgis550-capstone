import {
  Box,
  Button,
  ButtonGroup,
  Collapse,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
} from '@mui/material'
import { useMutation } from '@apollo/client'
import React, { useState } from 'react'

import {
  CreateProduct,
  FindAllProductsMatchModel,
} from '../../modules/products'
import { MODAL_BOX_STYLE } from './constants'
import { CreateDataEntry } from '../../modules/entries'
import { CreateAccount, FindAllAccountsMatchName } from '../../modules/accounts'
import { Center, ErrorMessage, QueryInput } from '../../components'

import type {
  Account,
  BaseResponse,
  BaseResponseError,
  CreateAccountInput,
  CreateAccountResponse,
  CreateDataEntryInput,
  CreateProductInput,
  CreateProductResponse,
  FindAllAccountsMatchNameResult,
  FindAllProductsMatchModelResult,
  LifeCycleState,
  Product,
} from '../../types'

const ExpandButton = React.lazy(() => import('../../components/ExpandButton'))

const initProductState: Product = {
  productName: '',
  manufacturer: '',
  model: '',
}

const initAccountState: Account = {
  name: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  country: 'United States',
  state: 'NY',
  city: '',
  zip: '',
}

export interface AddEntryModalProps {
  exit: () => void
}

interface ModalState {
  error: string
  product: Product
  productQueried: boolean
  productInfoVisible: boolean
  lifeCycleState: LifeCycleState
  serialNumber: string
  donor: Account
  donorQueried: boolean
  donorInfoVisible: boolean
  recipient: Account
  recipientQueried: boolean
  recipientInfoVisible: boolean
}

const initModalState: ModalState = {
  error: '',
  serialNumber: '',
  lifeCycleState: 'Pending',
  product: { ...initProductState },
  productQueried: false,
  productInfoVisible: false,
  donor: { ...initAccountState },
  donorQueried: false,
  donorInfoVisible: false,
  recipient: { ...initAccountState },
  recipientQueried: false,
  recipientInfoVisible: false,
}

export const AddEntryModal: React.FC<AddEntryModalProps> = ({ exit }) => {
  const [modalState, setModalState] = useState(initModalState)

  const [createAccount] = useMutation<
    CreateAccountResponse,
    CreateAccountInput
  >(CreateAccount)
  const [createDataEntry] = useMutation<BaseResponse, CreateDataEntryInput>(
    CreateDataEntry
  )
  const [createProduct] = useMutation<
    CreateProductResponse,
    CreateProductInput
  >(CreateProduct)

  const updateModalState = (state: Partial<ModalState>) => {
    setModalState({ ...modalState, ...state })
  }

  const setError = (error: string) => updateModalState({ error: error })
  const mapErrors = (errors: BaseResponseError[]) =>
    errors.map((value) => value.message).join('\r\n')

  const submitDataEntry = async () => {
    let productId: number | undefined = undefined
    let donorAccountId: number | undefined = undefined
    let recipientAccountId: number | undefined = undefined

    const { product, donor, recipient } = modalState

    if (!product) return setError('No product specified')
    else if (!product.productId) {
      const { data } = await createProduct({
        variables: { ...product },
      })
      if (data) {
        if (data.success === 'true') {
          productId = data.productId
        }
      } else return setError('Unknown error occured - Product')
    }

    if (!donor) return setError('No donor account specified')
    else if (!donor.accountId) {
      const { data } = await createAccount({
        variables: { ...donor },
      })
      if (data) {
        if (data.success === 'true') {
          donorAccountId = data.accountId
        } else if (data.errors) {
          return setError(mapErrors(data.errors))
        }
      } else return setError('Unknown error occured - Donor')
    }

    if (!recipient) return setError('No recipient account specified')
    else if (!recipient.accountId) {
      const { data } = await createAccount({
        variables: { ...recipient },
      })
      if (data) {
        if (data.success === 'true') {
          recipientAccountId = data.accountId
        } else if (data.errors) {
          return setError(mapErrors(data.errors))
        }
      } else return setError('Unknown error occured - Recipient')
    }

    const { data } = await createDataEntry({
      variables: {
        lifeCycleState: modalState.lifeCycleState,
        serialNumber: modalState.serialNumber,
        modified: new Date(),
        // -1 is used to signify invalid values
        // ... aptly displayed as 'N/A' in the data-grid view
        // ... but it shouldn't ever reach that point
        productId: productId || product.productId || -1,
        donorAccountId: donorAccountId || donor.accountId || -1,
        recipientAccountId: recipientAccountId || recipient.accountId || -1,
      },
    })

    if (data) {
      if (data.success === 'true') {
        alert(`Added device: '${modalState.serialNumber}'`)
        return setError('')
      } else if (data.errors) {
        return setError(mapErrors(data.errors))
      }
    }

    return setError('Unknown error occured - Data Entry')
  }

  return (
    <Box sx={MODAL_BOX_STYLE}>
      {modalState.error !== '' && (
        <div className='Add-entry-error'>
          <Center>
            <ErrorMessage error='Query error:' variant='h5' />
          </Center>
          <Center>
            <ErrorMessage error={modalState.error} variant='body1' />
          </Center>
          <div style={{ paddingBottom: '5px' }} />
        </div>
      )}
      <Center>
        <FormControl sx={{ m: 1, width: '50ch' }} variant='outlined'>
          <InputLabel htmlFor='model'>Product Model</InputLabel>
          <QueryInput
            apolloQuery={FindAllProductsMatchModel}
            getOptionLabel={(option: Product) => option.model}
            getQueryData={(data: FindAllProductsMatchModelResult) =>
              data.findAllProductsMatchModel as readonly Product[]
            }
            setOptionValue={(option: Product, setValue) => {
              setTimeout(
                () =>
                  updateModalState({
                    product: option,
                    productQueried: true,
                    productInfoVisible: false,
                  }),
                0
              )
              setValue(option.model)
            }}
            inputProps={{
              fullWidth: true,
              id: 'model',
              type: 'text',
              label: 'Product Model',
            }}
            onQueryFail={() => {
              updateModalState({
                productInfoVisible: true,
                productQueried: false,
              })
            }}
          />
          {!modalState.productQueried && (
            <ExpandButton
              expand={modalState.productInfoVisible}
              onClick={() =>
                updateModalState({
                  productInfoVisible: !modalState.productInfoVisible,
                })
              }
            />
          )}
        </FormControl>
      </Center>
      <Collapse in={modalState.productInfoVisible} timeout='auto' unmountOnExit>
        <Center>
          <Paper elevation={16}>
            <Center>
              <FormControl sx={{ m: 1, width: '50ch' }} variant='outlined'>
                <InputLabel htmlFor='product-name'>Product Type</InputLabel>
                <OutlinedInput
                  fullWidth
                  id='product-name'
                  type='text'
                  value={modalState.product.productName}
                  onChange={(event) => {
                    event.preventDefault()
                    updateModalState({
                      product: {
                        ...modalState.product,
                        productName: event.target.value,
                      },
                    })
                  }}
                  label='Product Type'
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl sx={{ m: 1, width: '50ch' }} variant='outlined'>
                <InputLabel htmlFor='manufacturer'>Manufacturer</InputLabel>
                <OutlinedInput
                  fullWidth
                  id='manufacturer'
                  type='text'
                  value={modalState.product.manufacturer}
                  onChange={(event) => {
                    event.preventDefault()
                    updateModalState({
                      product: {
                        ...modalState.product,
                        manufacturer: event.target.value,
                      },
                    })
                  }}
                  label='Manufacturer'
                />
              </FormControl>
            </Center>
          </Paper>
        </Center>
      </Collapse>
      <Center>
        <FormControl sx={{ m: 1, width: '50ch' }} variant='outlined'>
          <InputLabel id='lifecycle-select-label'>Email</InputLabel>
          <Select
            labelId='lifecycle-select-label'
            id='lifecycle-select'
            value={modalState.lifeCycleState}
            label='LifeCycle State'
            onChange={(event) => {
              event.preventDefault()
              updateModalState({
                lifeCycleState: event.target.value as LifeCycleState,
              })
            }}>
            <MenuItem value='Pending'>Pending</MenuItem>
            <MenuItem value='Received'>Received</MenuItem>
            <MenuItem value='Problem'>Problem</MenuItem>
            <MenuItem value='Distributed'>Distributed</MenuItem>
            <MenuItem value='E-Waste Scrapped'>E-Waste Scrapped</MenuItem>
          </Select>
        </FormControl>
      </Center>
      <Center>
        <FormControl sx={{ m: 1, width: '50ch' }} variant='outlined'>
          <InputLabel htmlFor='serial-number'>Serial Number</InputLabel>
          <OutlinedInput
            fullWidth
            id='serial-number'
            type='text'
            value={modalState.serialNumber}
            onChange={(event) => {
              event.preventDefault()
              updateModalState({ serialNumber: event.target.value })
            }}
            label='Serial Number'
          />
        </FormControl>
      </Center>
      <Center>
        <FormControl sx={{ m: 1, width: '50ch' }} variant='outlined'>
          <InputLabel htmlFor='donorAccount'>Donor Account</InputLabel>
          <QueryInput
            apolloQuery={FindAllAccountsMatchName}
            getOptionLabel={(option: Account) => option.name}
            getQueryData={(data: FindAllAccountsMatchNameResult) =>
              data.findAllAccountsMatchName as readonly Account[]
            }
            setOptionValue={(option: Account, setValue) => {
              setTimeout(
                () =>
                  updateModalState({
                    donor: option,
                    donorQueried: true,
                    donorInfoVisible: false,
                  }),
                0
              )
              setValue(option.name)
            }}
            inputProps={{
              fullWidth: true,
              id: 'donorAccount',
              type: 'text',
              label: 'Donor Account',
            }}
            onQueryFail={() => {
              updateModalState({ donorInfoVisible: true, donorQueried: false })
            }}
          />
          {!modalState.donorQueried && (
            <ExpandButton
              expand={modalState.donorInfoVisible}
              onClick={() =>
                updateModalState({
                  donorInfoVisible: !modalState.donorInfoVisible,
                })
              }
            />
          )}
        </FormControl>
      </Center>
      <Collapse in={modalState.donorInfoVisible} timeout='auto' unmountOnExit>
        <Center>
          <Paper elevation={16}>
            <Center>
              <FormControl sx={{ m: 1, width: '50ch' }} variant='outlined'>
                <InputLabel htmlFor='donor-phone'>Phone Number</InputLabel>
                <OutlinedInput
                  fullWidth
                  id='donor-phone'
                  type='text'
                  value={modalState.donor.phone}
                  onChange={(event) => {
                    event.preventDefault()
                    updateModalState({
                      donor: { ...modalState.donor, phone: event.target.value },
                    })
                  }}
                  label='Phone Number'
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl sx={{ m: 1, width: '50ch' }} variant='outlined'>
                <InputLabel htmlFor='donor-addressLine1'>
                  Address Line 1
                </InputLabel>
                <OutlinedInput
                  fullWidth
                  id='donor-addressLine1'
                  type='text'
                  value={modalState.donor.addressLine1}
                  onChange={(event) => {
                    event.preventDefault()
                    updateModalState({
                      donor: {
                        ...modalState.donor,
                        addressLine1: event.target.value,
                      },
                    })
                  }}
                  label='Address Line 1'
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl sx={{ m: 1, width: '50ch' }} variant='outlined'>
                <InputLabel htmlFor='donor-addressLine2'>
                  Address Line 2
                </InputLabel>
                <OutlinedInput
                  fullWidth
                  id='donor-addressLine2'
                  type='text'
                  value={modalState.donor.addressLine2}
                  onChange={(event) => {
                    event.preventDefault()
                    updateModalState({
                      donor: {
                        ...modalState.donor,
                        addressLine2: event.target.value,
                      },
                    })
                  }}
                  label='Address Line 2'
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl sx={{ m: 1, width: '50ch' }} variant='outlined'>
                <InputLabel htmlFor='donor-country'>Country</InputLabel>
                <OutlinedInput
                  fullWidth
                  id='donor-country'
                  type='text'
                  value={modalState.donor.country}
                  onChange={(event) => {
                    event.preventDefault()
                    updateModalState({
                      donor: {
                        ...modalState.donor,
                        country: event.target.value,
                      },
                    })
                  }}
                  label='Country'
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl sx={{ m: 1, width: '50ch' }} variant='outlined'>
                <InputLabel htmlFor='donor-state'>State</InputLabel>
                <OutlinedInput
                  fullWidth
                  id='donor-state'
                  type='text'
                  value={modalState.donor.state}
                  onChange={(event) => {
                    event.preventDefault()
                    updateModalState({
                      donor: { ...modalState.donor, state: event.target.value },
                    })
                  }}
                  label='State'
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl sx={{ m: 1, width: '50ch' }} variant='outlined'>
                <InputLabel htmlFor='donor-city'>City</InputLabel>
                <OutlinedInput
                  fullWidth
                  id='donor-city'
                  type='text'
                  value={modalState.donor.city}
                  onChange={(event) => {
                    event.preventDefault()
                    updateModalState({
                      donor: { ...modalState.donor, city: event.target.value },
                    })
                  }}
                  label='City'
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl sx={{ m: 1, width: '50ch' }} variant='outlined'>
                <InputLabel htmlFor='donor-zip'>ZIP Code</InputLabel>
                <OutlinedInput
                  fullWidth
                  id='donor-zip'
                  type='text'
                  value={modalState.donor.zip}
                  onChange={(event) => {
                    event.preventDefault()
                    updateModalState({
                      donor: { ...modalState.donor, zip: event.target.value },
                    })
                  }}
                  label='ZIP Code'
                />
              </FormControl>
            </Center>
          </Paper>
        </Center>
      </Collapse>
      <Center>
        <FormControl sx={{ m: 1, width: '50ch' }} variant='outlined'>
          <InputLabel htmlFor='recipientAccount'>Recipient Account</InputLabel>
          <QueryInput
            apolloQuery={FindAllAccountsMatchName}
            getOptionLabel={(option: Account) => option.name}
            getQueryData={(data: FindAllAccountsMatchNameResult) =>
              data.findAllAccountsMatchName as readonly Account[]
            }
            setOptionValue={(option: Account, setValue) => {
              setTimeout(
                () =>
                  updateModalState({
                    recipient: option,
                    recipientQueried: true,
                    recipientInfoVisible: false,
                  }),
                0
              )
              setValue(option.name)
            }}
            inputProps={{
              fullWidth: true,
              id: 'recipientAccount',
              type: 'text',
              label: 'Recipient Account',
            }}
            onQueryFail={() => {
              updateModalState({
                recipientInfoVisible: true,
                recipientQueried: false,
              })
            }}
          />
          {!modalState.recipientQueried && (
            <ExpandButton
              expand={modalState.recipientInfoVisible}
              onClick={() =>
                updateModalState({
                  recipientInfoVisible: !modalState.recipientInfoVisible,
                })
              }
            />
          )}
        </FormControl>
      </Center>
      <Collapse
        in={modalState.recipientInfoVisible}
        timeout='auto'
        unmountOnExit>
        <Center>
          <Paper elevation={16}>
            <Center>
              <FormControl sx={{ m: 1, width: '50ch' }} variant='outlined'>
                <InputLabel htmlFor='recipient-phone'>Phone Number</InputLabel>
                <OutlinedInput
                  fullWidth
                  id='recipient-phone'
                  type='text'
                  value={modalState.recipient.phone}
                  onChange={(event) => {
                    event.preventDefault()
                    updateModalState({
                      recipient: {
                        ...modalState.recipient,
                        phone: event.target.value,
                      },
                    })
                  }}
                  label='Phone Number'
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl sx={{ m: 1, width: '50ch' }} variant='outlined'>
                <InputLabel htmlFor='recipient-addressLine1'>
                  Address Line 1
                </InputLabel>
                <OutlinedInput
                  fullWidth
                  id='recipient-addressLine1'
                  type='text'
                  value={modalState.recipient.addressLine1}
                  onChange={(event) => {
                    event.preventDefault()
                    updateModalState({
                      recipient: {
                        ...modalState.recipient,
                        addressLine1: event.target.value,
                      },
                    })
                  }}
                  label='Address Line 1'
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl sx={{ m: 1, width: '50ch' }} variant='outlined'>
                <InputLabel htmlFor='recipient-addressLine2'>
                  Address Line 2
                </InputLabel>
                <OutlinedInput
                  fullWidth
                  id='recipient-addressLine2'
                  type='text'
                  value={modalState.recipient.addressLine2}
                  onChange={(event) => {
                    event.preventDefault()
                    updateModalState({
                      recipient: {
                        ...modalState.recipient,
                        addressLine2: event.target.value,
                      },
                    })
                  }}
                  label='Address Line 2'
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl sx={{ m: 1, width: '50ch' }} variant='outlined'>
                <InputLabel htmlFor='recipient-country'>Country</InputLabel>
                <OutlinedInput
                  fullWidth
                  id='recipient-country'
                  type='text'
                  value={modalState.recipient.country}
                  onChange={(event) => {
                    event.preventDefault()
                    updateModalState({
                      recipient: {
                        ...modalState.recipient,
                        country: event.target.value,
                      },
                    })
                  }}
                  label='Country'
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl sx={{ m: 1, width: '50ch' }} variant='outlined'>
                <InputLabel htmlFor='recipient-state'>State</InputLabel>
                <OutlinedInput
                  fullWidth
                  id='recipient-state'
                  type='text'
                  value={modalState.recipient.state}
                  onChange={(event) => {
                    event.preventDefault()
                    updateModalState({
                      recipient: {
                        ...modalState.recipient,
                        state: event.target.value,
                      },
                    })
                  }}
                  label='State'
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl sx={{ m: 1, width: '50ch' }} variant='outlined'>
                <InputLabel htmlFor='recipient-city'>City</InputLabel>
                <OutlinedInput
                  fullWidth
                  id='recipient-city'
                  type='text'
                  value={modalState.recipient.city}
                  onChange={(event) => {
                    event.preventDefault()
                    updateModalState({
                      recipient: {
                        ...modalState.recipient,
                        city: event.target.value,
                      },
                    })
                  }}
                  label='City'
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl sx={{ m: 1, width: '50ch' }} variant='outlined'>
                <InputLabel htmlFor='recipient-zip'>ZIP Code</InputLabel>
                <OutlinedInput
                  fullWidth
                  id='recipient-zip'
                  type='text'
                  value={modalState.recipient.zip}
                  onChange={(event) => {
                    event.preventDefault()
                    updateModalState({
                      recipient: {
                        ...modalState.recipient,
                        zip: event.target.value,
                      },
                    })
                  }}
                  label='ZIP Code'
                />
              </FormControl>
            </Center>
          </Paper>
        </Center>
      </Collapse>
      <Center>
        <ButtonGroup sx={{ bottom: 0 }} variant='contained'>
          <Button color='success' onClick={submitDataEntry}>
            Add Entry
          </Button>
          <Button color='error' onClick={exit}>
            Close Form
          </Button>
        </ButtonGroup>
      </Center>
    </Box>
  )
}

export default AddEntryModal

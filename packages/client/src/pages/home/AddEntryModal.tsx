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
  Typography,
} from '@mui/material'
import { useMutation } from '@apollo/client'
import React, { useState } from 'react'

import { CreateDataEntry } from '../../modules/entries'
import { CreateAccount, FindAllAccounts } from '../../modules/accounts'
import { CreateProduct, FindAllProducts } from '../../modules/products'

import { LIFECYCLE_STATES, MODAL_BOX_STYLE, NEW_ITEM_MARKER } from './constants'
import { Center, ErrorMessage, QuerySelect } from '../../components'

import type {
  Account,
  BaseResponseError,
  CreateAccountInput,
  CreateAccountResponse,
  CreateDataEntryInput,
  CreateDataEntryResponse,
  CreateProductInput,
  CreateProductResponse,
  FindAllAccountsResult,
  FindAllProductsResult,
  LifeCycleState,
  Product,
} from '../../types'

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

export const AddEntryModal: React.FC<AddEntryModalProps> = ({ exit }) => {
  const [error, setError] = useState<string>('')

  const [product, setProduct] = useState<Product>(initProductState)
  const [productInfoVisible, setProductInfoVisible] = useState<boolean>(false)

  const [lifeCycleState, setLifeCycleState] =
    useState<LifeCycleState>('PENDING')
  const [serialNum, setSerialNum] = useState<string>('')

  const [donor, setDonor] = useState<Account>(initAccountState)
  const [donorInfoVisible, setDonorInfoVisible] = useState<boolean>(false)

  const [recipient, setRecipient] = useState<Account>(initAccountState)
  const [recipientInfoVisible, setRecipientInfoVisible] =
    useState<boolean>(false)

  const [createAccount] = useMutation<
    CreateAccountResponse,
    CreateAccountInput
  >(CreateAccount)
  const [createDataEntry] = useMutation<
    CreateDataEntryResponse,
    CreateDataEntryInput
  >(CreateDataEntry)
  const [createProduct] = useMutation<
    CreateProductResponse,
    CreateProductInput
  >(CreateProduct)

  const mapErrors = (errors: BaseResponseError[]) =>
    errors.map((value) => value.message).join('\r\n')

  const submitDataEntry = async () => {
    if (serialNum === '') return setError('No serial number specified')

    let selectedProductId = product.productId
    let donorAccountId = donor.accountId
    let recipientAccountId = recipient.accountId

    switch (true) {
      case product.model === '':
        return setError('Invalid product model')
      case product.manufacturer === '':
        return setError('Invalid product manufacturer')
      case product.productName === '':
        return setError('Invalid product type')
      case !selectedProductId:
        const { data } = await createProduct({
          variables: { input: { ...product } },
        })
        if (data && data.createProduct) {
          const { success, productId } = data.createProduct
          if (success === 'true') {
            selectedProductId = productId
          }
        }
    }

    switch (true) {
      case donor.name === '':
        return setError('Invalid donor name')
      case donor.phone === '':
        return setError('Invalid donor phone')
      case donor.addressLine1 === '':
        return setError('Invalid donor address')
      case donor.city === '':
        return setError('Invalid donor city')
      case donor.country === '':
        return setError('Invalid donor country')
      case donor.state === '':
        return setError('Invalid donor state')
      case donor.zip === '':
        return setError('Invalid donor ZIP code')
      case !donorAccountId:
        const { data } = await createAccount({
          variables: { input: { ...donor } },
        })
        if (data && data.createAccount) {
          const { success, accountId } = data.createAccount
          if (success === 'true') {
            donorAccountId = accountId
          }
        }
    }

    switch (true) {
      case recipient.name === '':
        return setError('Invalid recipient name')
      case recipient.phone === '':
        return setError('Invalid recipient phone')
      case recipient.addressLine1 === '':
        return setError('Invalid recipient address')
      case recipient.city === '':
        return setError('Invalid recipient city')
      case recipient.country === '':
        return setError('Invalid recipient country')
      case recipient.state === '':
        return setError('Invalid recipient state')
      case recipient.zip === '':
        return setError('Invalid recipient ZIP code')
      case !recipientAccountId:
        const { data } = await createAccount({
          variables: { input: { ...recipient } },
        })
        if (data && data.createAccount) {
          const { success, accountId } = data.createAccount
          if (success === 'true') {
            recipientAccountId = accountId
          }
        }
    }

    const { data } = await createDataEntry({
      variables: {
        input: {
          lifeCycleState: lifeCycleState,
          serialNumber: serialNum,
          modified: new Date(),
          // -1 signifies that I goofed up somewhere
          productId: selectedProductId || -1,
          donorAccountId: donorAccountId || -1,
          recipientAccountId: recipientAccountId || -1,
        },
      },
    })

    if (data && data.createDataEntry) {
      const { success, errors } = data.createDataEntry
      if (success === 'true') {
        alert(`Added device: '${serialNum}'`)
        setTimeout(() => setSerialNum(''), 0)
        return setError('')
      } else if (errors) {
        return setError(mapErrors(errors))
      }
    }

    return setError('Unknown error occured')
  }

  return (
    <Box sx={MODAL_BOX_STYLE}>
      <Center>
        <Typography variant='h4'>Add Device Entry</Typography>
      </Center>
      <div style={{ paddingBottom: '20px' }} />
      {error !== '' && (
        <div className='Add-entry-error'>
          <Center>
            <ErrorMessage error='Query error:' variant='h5' />
          </Center>
          <Center>
            <ErrorMessage error={error} variant='body1' />
          </Center>
          <div style={{ paddingBottom: '5px' }} />
        </div>
      )}
      <Center>
        <FormControl required sx={{ m: 1, width: '50ch' }} variant='outlined'>
          <InputLabel id='lifecycle-select-label'>Life-Cycle State</InputLabel>
          <Select
            labelId='lifecycle-select-label'
            id='lifecycle-select'
            value={lifeCycleState}
            defaultValue={LIFECYCLE_STATES.Pending}
            label='LifeCycle State'
            onChange={(event) => {
              event.preventDefault()
              setLifeCycleState(event.target.value as LifeCycleState)
            }}>
            {Object.entries(LIFECYCLE_STATES).map(([key, value], index) => (
              <MenuItem key={index} value={value}>
                {key}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Center>
      <Center>
        <FormControl required sx={{ m: 1, width: '50ch' }} variant='outlined'>
          <InputLabel htmlFor='model'>Product Model</InputLabel>
          <QuerySelect
            apolloQuery={FindAllProducts}
            defaultValue={NEW_ITEM_MARKER}
            getQueryData={(data: FindAllProductsResult) => data.findAllProducts}
            getQueryDataValueLabel={(value: Product) => value.model}
            onDataSelected={(value: Product | typeof NEW_ITEM_MARKER) => {
              if (value !== NEW_ITEM_MARKER) {
                setTimeout(() => setProductInfoVisible(false), 0)
                setProduct(value)
              } else {
                setTimeout(() => setProductInfoVisible(true), 0)
                setProduct({ ...product })
              }
            }}
            onQueryFail={() => setProductInfoVisible(true)}
          />
        </FormControl>
      </Center>
      <Collapse in={productInfoVisible} timeout='auto' unmountOnExit>
        <Center>
          <Paper elevation={8}>
            <Center>
              <FormControl
                required={productInfoVisible}
                sx={{ m: 1, width: '50ch' }}
                variant='outlined'>
                <InputLabel htmlFor='product-model'>Product Model</InputLabel>
                <OutlinedInput
                  fullWidth
                  id='product-model'
                  type='text'
                  value={product.model}
                  onChange={(event) => {
                    event.preventDefault()
                    let newProduct = { ...product }
                    newProduct.model = event.target.value
                    setProduct(newProduct)
                  }}
                  label='Product Model'
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl
                required={productInfoVisible}
                sx={{ m: 1, width: '50ch' }}
                variant='outlined'>
                <InputLabel htmlFor='manufacturer'>Manufacturer</InputLabel>
                <OutlinedInput
                  fullWidth
                  id='manufacturer'
                  type='text'
                  value={product.manufacturer}
                  onChange={(event) => {
                    event.preventDefault()
                    let newProduct = { ...product }
                    newProduct.manufacturer = event.target.value
                    setProduct(newProduct)
                  }}
                  label='Manufacturer'
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl
                required={productInfoVisible}
                sx={{ m: 1, width: '50ch' }}
                variant='outlined'>
                <InputLabel htmlFor='product-name'>Product Type</InputLabel>
                <OutlinedInput
                  fullWidth
                  id='product-name'
                  type='text'
                  value={product.productName}
                  onChange={(event) => {
                    event.preventDefault()
                    let newProduct = { ...product }
                    newProduct.productName = event.target.value
                    setProduct(newProduct)
                  }}
                  label='Product Type'
                />
              </FormControl>
            </Center>
          </Paper>
        </Center>
        <div style={{ paddingBottom: '20px' }} />
      </Collapse>
      <Center>
        <FormControl required sx={{ m: 1, width: '50ch' }} variant='outlined'>
          <InputLabel htmlFor='serial-number'>Serial Number</InputLabel>
          <OutlinedInput
            fullWidth
            id='serial-number'
            type='text'
            value={serialNum}
            onChange={(event) => {
              event.preventDefault()
              setSerialNum(event.target.value.toUpperCase())
            }}
            label='Serial Number'
          />
        </FormControl>
      </Center>
      <Center>
        <FormControl required sx={{ m: 1, width: '50ch' }} variant='outlined'>
          <InputLabel htmlFor='donorAccount'>Donor Account</InputLabel>
          <QuerySelect
            apolloQuery={FindAllAccounts}
            defaultValue={NEW_ITEM_MARKER}
            getQueryData={(data: FindAllAccountsResult) => data.findAllAccounts}
            getQueryDataValueLabel={(value: Account) => value.name}
            onDataSelected={(value: Account | typeof NEW_ITEM_MARKER) => {
              if (value !== NEW_ITEM_MARKER) {
                setTimeout(() => setDonorInfoVisible(false), 0)
                setDonor(value)
              } else {
                setTimeout(() => setDonorInfoVisible(true), 0)
                setDonor({ ...donor })
              }
            }}
            onQueryFail={() => setDonorInfoVisible(true)}
          />
        </FormControl>
      </Center>
      <Collapse in={donorInfoVisible} timeout='auto' unmountOnExit>
        <Center>
          <Paper elevation={8}>
            <Center>
              <FormControl
                required={donorInfoVisible}
                sx={{ m: 1, width: '50ch' }}
                variant='outlined'>
                <InputLabel htmlFor='donor-name'>Account Name</InputLabel>
                <OutlinedInput
                  fullWidth
                  id='donor-name'
                  type='text'
                  value={donor.name}
                  onChange={(event) => {
                    event.preventDefault()
                    let newDonor = { ...donor }
                    newDonor.name = event.target.value
                    setDonor(newDonor)
                  }}
                  label='Account Name'
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl
                required={donorInfoVisible}
                sx={{ m: 1, width: '50ch' }}
                variant='outlined'>
                <InputLabel htmlFor='donor-phone'>Phone Number</InputLabel>
                <OutlinedInput
                  fullWidth
                  id='donor-phone'
                  type='text'
                  value={donor.phone}
                  onChange={(event) => {
                    event.preventDefault()
                    let newDonor = { ...donor }
                    newDonor.phone = event.target.value
                    setDonor(newDonor)
                  }}
                  label='Phone Number'
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl
                required={donorInfoVisible}
                sx={{ m: 1, width: '50ch' }}
                variant='outlined'>
                <InputLabel htmlFor='donor-addressLine1'>
                  Address Line 1
                </InputLabel>
                <OutlinedInput
                  fullWidth
                  id='donor-addressLine1'
                  type='text'
                  value={donor.addressLine1}
                  onChange={(event) => {
                    event.preventDefault()
                    let newDonor = { ...donor }
                    newDonor.addressLine1 = event.target.value
                    setDonor(newDonor)
                  }}
                  label='Address Line 1'
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl
                required={donorInfoVisible}
                sx={{ m: 1, width: '50ch' }}
                variant='outlined'>
                <InputLabel htmlFor='donor-addressLine2'>
                  Address Line 2
                </InputLabel>
                <OutlinedInput
                  fullWidth
                  id='donor-addressLine2'
                  type='text'
                  value={donor.addressLine2}
                  onChange={(event) => {
                    event.preventDefault()
                    let newDonor = { ...donor }
                    newDonor.addressLine2 = event.target.value
                    setDonor(newDonor)
                  }}
                  label='Address Line 2'
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl
                required={donorInfoVisible}
                sx={{ m: 1, width: '50ch' }}
                variant='outlined'>
                <InputLabel htmlFor='donor-country'>Country</InputLabel>
                <OutlinedInput
                  fullWidth
                  id='donor-country'
                  type='text'
                  value={donor.country}
                  onChange={(event) => {
                    event.preventDefault()
                    let newDonor = { ...donor }
                    newDonor.country = event.target.value
                    setDonor(newDonor)
                  }}
                  label='Country'
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl
                required={donorInfoVisible}
                sx={{ m: 1, width: '50ch' }}
                variant='outlined'>
                <InputLabel htmlFor='donor-state'>State</InputLabel>
                <OutlinedInput
                  fullWidth
                  id='donor-state'
                  type='text'
                  value={donor.state}
                  onChange={(event) => {
                    event.preventDefault()
                    let newDonor = { ...donor }
                    newDonor.state = event.target.value
                    setDonor(newDonor)
                  }}
                  label='State'
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl
                required={donorInfoVisible}
                sx={{ m: 1, width: '50ch' }}
                variant='outlined'>
                <InputLabel htmlFor='donor-city'>City</InputLabel>
                <OutlinedInput
                  fullWidth
                  id='donor-city'
                  type='text'
                  value={donor.city}
                  onChange={(event) => {
                    event.preventDefault()
                    let newDonor = { ...donor }
                    newDonor.city = event.target.value
                    setDonor(newDonor)
                  }}
                  label='City'
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl
                required={donorInfoVisible}
                sx={{ m: 1, width: '50ch' }}
                variant='outlined'>
                <InputLabel htmlFor='donor-zip'>ZIP Code</InputLabel>
                <OutlinedInput
                  fullWidth
                  id='donor-zip'
                  type='text'
                  value={donor.zip}
                  onChange={(event) => {
                    event.preventDefault()
                    let newDonor = { ...donor }
                    newDonor.zip = event.target.value
                    setDonor(newDonor)
                  }}
                  label='ZIP Code'
                />
              </FormControl>
            </Center>
          </Paper>
        </Center>
        <div style={{ paddingBottom: '20px' }} />
      </Collapse>
      <Center>
        <FormControl required sx={{ m: 1, width: '50ch' }} variant='outlined'>
          <InputLabel htmlFor='recipientAccount'>Recipient Account</InputLabel>
          <QuerySelect
            apolloQuery={FindAllAccounts}
            defaultValue={NEW_ITEM_MARKER}
            getQueryData={(data: FindAllAccountsResult) => data.findAllAccounts}
            getQueryDataValueLabel={(value: Account) => value.name}
            onDataSelected={(value: Account | typeof NEW_ITEM_MARKER) => {
              if (value !== NEW_ITEM_MARKER) {
                setTimeout(() => setRecipientInfoVisible(false), 0)
                setRecipient(value)
              } else {
                setTimeout(() => setRecipientInfoVisible(true), 0)
                setRecipient({ ...recipient })
              }
            }}
            onQueryFail={() => setRecipientInfoVisible(true)}
          />
        </FormControl>
      </Center>
      <Collapse in={recipientInfoVisible} timeout='auto' unmountOnExit>
        <Center>
          <Paper elevation={8}>
            <Center>
              <FormControl
                required={recipientInfoVisible}
                sx={{ m: 1, width: '50ch' }}
                variant='outlined'>
                <InputLabel htmlFor='recipient-name'>Account Name</InputLabel>
                <OutlinedInput
                  fullWidth
                  id='recipient-name'
                  type='text'
                  value={recipient.name}
                  onChange={(event) => {
                    event.preventDefault()
                    let newRecipient = { ...recipient }
                    newRecipient.name = event.target.value
                    setRecipient(newRecipient)
                  }}
                  label='Account Name'
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl
                required={recipientInfoVisible}
                sx={{ m: 1, width: '50ch' }}
                variant='outlined'>
                <InputLabel htmlFor='recipient-phone'>Phone Number</InputLabel>
                <OutlinedInput
                  fullWidth
                  id='recipient-phone'
                  type='text'
                  value={recipient.phone}
                  onChange={(event) => {
                    event.preventDefault()
                    let newRecipient = { ...recipient }
                    newRecipient.phone = event.target.value
                    setRecipient(newRecipient)
                  }}
                  label='Phone Number'
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl
                required={recipientInfoVisible}
                sx={{ m: 1, width: '50ch' }}
                variant='outlined'>
                <InputLabel htmlFor='recipient-addressLine1'>
                  Address Line 1
                </InputLabel>
                <OutlinedInput
                  fullWidth
                  id='recipient-addressLine1'
                  type='text'
                  value={recipient.addressLine1}
                  onChange={(event) => {
                    event.preventDefault()
                    let newRecipient = { ...recipient }
                    newRecipient.addressLine1 = event.target.value
                    setRecipient(newRecipient)
                  }}
                  label='Address Line 1'
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl
                required={recipientInfoVisible}
                sx={{ m: 1, width: '50ch' }}
                variant='outlined'>
                <InputLabel htmlFor='recipient-addressLine2'>
                  Address Line 2
                </InputLabel>
                <OutlinedInput
                  fullWidth
                  id='recipient-addressLine2'
                  type='text'
                  value={recipient.addressLine2}
                  onChange={(event) => {
                    event.preventDefault()
                    let newRecipient = { ...recipient }
                    newRecipient.addressLine2 = event.target.value
                    setRecipient(newRecipient)
                  }}
                  label='Address Line 2'
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl
                required={recipientInfoVisible}
                sx={{ m: 1, width: '50ch' }}
                variant='outlined'>
                <InputLabel htmlFor='recipient-country'>Country</InputLabel>
                <OutlinedInput
                  fullWidth
                  id='recipient-country'
                  type='text'
                  value={recipient.country}
                  onChange={(event) => {
                    event.preventDefault()
                    let newRecipient = { ...recipient }
                    newRecipient.country = event.target.value
                    setRecipient(newRecipient)
                  }}
                  label='Country'
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl
                required={recipientInfoVisible}
                sx={{ m: 1, width: '50ch' }}
                variant='outlined'>
                <InputLabel htmlFor='recipient-state'>State</InputLabel>
                <OutlinedInput
                  fullWidth
                  id='recipient-state'
                  type='text'
                  value={recipient.state}
                  onChange={(event) => {
                    event.preventDefault()
                    let newRecipient = { ...recipient }
                    newRecipient.state = event.target.value
                    setRecipient(newRecipient)
                  }}
                  label='State'
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl
                required={recipientInfoVisible}
                sx={{ m: 1, width: '50ch' }}
                variant='outlined'>
                <InputLabel htmlFor='recipient-city'>City</InputLabel>
                <OutlinedInput
                  fullWidth
                  id='recipient-city'
                  type='text'
                  value={recipient.city}
                  onChange={(event) => {
                    event.preventDefault()
                    let newRecipient = { ...recipient }
                    newRecipient.city = event.target.value
                    setRecipient(newRecipient)
                  }}
                  label='City'
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl
                required={recipientInfoVisible}
                sx={{ m: 1, width: '50ch' }}
                variant='outlined'>
                <InputLabel htmlFor='recipient-zip'>ZIP Code</InputLabel>
                <OutlinedInput
                  fullWidth
                  id='recipient-zip'
                  type='text'
                  value={recipient.zip}
                  onChange={(event) => {
                    event.preventDefault()
                    let newRecipient = { ...recipient }
                    newRecipient.zip = event.target.value
                    setRecipient(newRecipient)
                  }}
                  label='ZIP Code'
                />
              </FormControl>
            </Center>
          </Paper>
        </Center>
        <div style={{ paddingBottom: '30px' }} />
      </Collapse>
      <div style={{ paddingTop: '5px' }} />
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

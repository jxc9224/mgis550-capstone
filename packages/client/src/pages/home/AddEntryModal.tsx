import {
  Box,
  Button,
  ButtonGroup,
  Collapse,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Typography,
} from '@mui/material'
import { useMutation } from '@apollo/client'
import React, { useEffect, useState } from 'react'

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

export const AddEntryModal: React.FC<AddEntryModalProps> = ({ exit }) => {
  const [error, setError] = useState<string>('')

  const [product, setProduct] = useState<Product>(initProductState)
  const [productQueried, setProductQueried] = useState<boolean>(false)
  const [productInfoVisible, setProductInfoVisible] = useState<boolean>(false)

  const [lcState, setLcState] = useState<LifeCycleState>('Pending')
  const [serialNum, setSerialNum] = useState<string>('')

  const [donor, setDonor] = useState<Account>(initAccountState)
  const [donorQueried, setDonorQueried] = useState<boolean>(false)
  const [donorInfoVisible, setDonorInfoVisible] = useState<boolean>(false)

  const [recipient, setRecipient] = useState<Account>(initAccountState)
  const [recipientQueried, setRecipientQueried] = useState<boolean>(false)
  const [recipientInfoVisible, setRecipientInfoVisible] =
    useState<boolean>(false)

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

  // update components when product changes
  useEffect(() => {
    if (donorQueried) setDonorInfoVisible(false)
    if (productQueried) setProductInfoVisible(false)
    if (recipientQueried) setRecipientInfoVisible(false)
  }, [product, productQueried, donorQueried, recipientQueried])

  const mapErrors = (errors: BaseResponseError[]) =>
    errors.map((value) => value.message).join('\r\n')

  const submitDataEntry = async () => {
    let productId: number | undefined = undefined
    let donorAccountId: number | undefined = undefined
    let recipientAccountId: number | undefined = undefined

    if (!product) return setError('No product specified')
    else if (!product.productId) {
      const { data } = await createProduct({ variables: { ...product } })
      if (data) {
        if (data.success === 'true') {
          productId = data.productId
        }
      }
    }

    if (!donor) return setError('No donor account specified')
    else if (!donor.accountId) {
      const { data } = await createAccount({ variables: { ...donor } })
      if (data) {
        if (data.success === 'true') {
          donorAccountId = data.accountId
        } else if (data.errors) {
          return setError(mapErrors(data.errors))
        }
      }
    }

    if (!recipient) return setError('No recipient account specified')
    else if (!recipient.accountId) {
      const { data } = await createAccount({ variables: { ...recipient } })
      if (data) {
        if (data.success === 'true') {
          recipientAccountId = data.accountId
        } else if (data.errors) {
          return setError(mapErrors(data.errors))
        }
      }
    }

    const { data } = await createDataEntry({
      variables: {
        lifeCycleState: lcState,
        serialNumber: serialNum,
        modified: new Date(),
        productId: productId || product.productId || -1,
        donorAccountId: donorAccountId || donor.accountId || -1,
        recipientAccountId: recipientAccountId || recipient.accountId || -1,
      },
    })

    if (data) {
      if (data.success === 'true') {
        alert(`Added device: '${serialNum}'`)
        return setError('')
      } else if (data.errors) {
        return setError(mapErrors(data.errors))
      }
    }

    return setError('Unknown error occured')
  }

  return (
    <Box sx={MODAL_BOX_STYLE}>
      <Center>
        <Typography variant='h3'>Add Data Entry</Typography>
      </Center>
      <div style={{ paddingBottom: '10px' }} />
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
            value={lcState}
            label='LifeCycle State'
            onChange={(event) => {
              event.preventDefault()
              setLcState(event.target.value as LifeCycleState)
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
        <FormControl required sx={{ m: 1, width: '50ch' }} variant='outlined'>
          <InputLabel htmlFor='model'>Product Model</InputLabel>
          <QueryInput
            apolloQuery={FindAllProductsMatchModel}
            getOptionLabel={(option: Product) => option.model}
            getQueryData={(data: FindAllProductsMatchModelResult) =>
              data.findAllProductsMatchModel as readonly Product[]
            }
            setOptionValue={(option: Product, setValue) => {
              setTimeout(() => setProduct(option), 0)
              setTimeout(() => setProductQueried(true), 0)
              setValue(option.model)
            }}
            inputProps={{
              fullWidth: true,
              id: 'model',
              type: 'text',
              label: 'Product Model',
            }}
            onQueryFail={() => setProductQueried(false)}
          />
          {!productQueried && (
            <FormControlLabel
              control={
                <ExpandButton
                  expand={productInfoVisible}
                  onClick={() => setProductInfoVisible(!productInfoVisible)}
                />
              }
              label='Add New Product'
            />
          )}
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
          </Paper>
        </Center>
        <div style={{ paddingBottom: '40px' }} />
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
          <InputLabel htmlFor='donorAccount'>{`Donor Account${
            donorInfoVisible ? ' Name' : ''
          }`}</InputLabel>
          <QueryInput
            apolloQuery={FindAllAccountsMatchName}
            getOptionLabel={(option: Account) => option.name}
            getQueryData={(data: FindAllAccountsMatchNameResult) =>
              data.findAllAccountsMatchName as readonly Account[]
            }
            setOptionValue={(option: Account, setValue) => {
              setTimeout(() => setDonor(option), 0)
              setValue(option.name)
            }}
            inputProps={{
              fullWidth: true,
              id: 'donorAccount',
              type: 'text',
              label: `Donor Account${donorInfoVisible ? ' Name' : ''}`,
            }}
            onQueryFail={() => setDonorQueried(false)}
          />
          {!donorQueried && (
            <FormControlLabel
              control={
                <ExpandButton
                  expand={donorInfoVisible}
                  onClick={() => setDonorInfoVisible(!donorInfoVisible)}
                />
              }
              label='Add New Account'
            />
          )}
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
        <div style={{ paddingBottom: '40px' }} />
      </Collapse>
      <Center>
        <FormControl required sx={{ m: 1, width: '50ch' }} variant='outlined'>
          <InputLabel htmlFor='recipientAccount'>
            {`Recipient Account${recipientInfoVisible ? ' Name' : ''}`}
          </InputLabel>
          <QueryInput
            apolloQuery={FindAllAccountsMatchName}
            getOptionLabel={(option: Account) => option.name}
            getQueryData={(data: FindAllAccountsMatchNameResult) =>
              data.findAllAccountsMatchName as readonly Account[]
            }
            setOptionValue={(option: Account, setValue) => {
              setTimeout(() => setRecipient(option), 0)
              setValue(option.name)
            }}
            inputProps={{
              fullWidth: true,
              id: 'recipientAccount',
              type: 'text',
              label: `Recipient Account${recipientInfoVisible ? ' Name' : ''}`,
            }}
            onQueryFail={() => setRecipientQueried(false)}
          />
          {!recipientQueried && (
            <FormControlLabel
              control={
                <ExpandButton
                  expand={recipientInfoVisible}
                  onClick={() => setRecipientInfoVisible(!recipientInfoVisible)}
                />
              }
              label='Add New Account'
            />
          )}
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
        <div style={{ paddingBottom: '35px' }} />
      </Collapse>
      <div style={{ paddingTop: '15px' }} />
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

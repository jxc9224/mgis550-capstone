/**
 * @author John Carr <jxc9224@rit.edu>
 * @license MIT
 */

import {
  Box,
  Button,
  ButtonGroup,
  Drawer,
  FormControl,
  InputLabel,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from '@mui/material'
import { GridRowId, GridSelectionModel } from '@mui/x-data-grid'
import { useLazyQuery, useMutation } from '@apollo/client'
import React, { useState } from 'react'

import { UpdateDataEntry } from '../../modules/entries'
import {
  FindAllAccounts,
  FindFirstAccountMatchName,
} from '../../modules/accounts'

import {
  LIFECYCLE_STATES,
  MODAL_BOX_STYLE,
  getDateStringFromISO,
} from './constants'
import { Center, ErrorMessage, QuerySelect } from '../../components'

import type {
  AccountQueryRow,
  DataGridModelRow,
  FindAllAccountsResult,
  FindFirstAccountMatchNameResult,
  LifeCycleState,
  UpdateDataEntryInput,
  UpdateDataEntryResponse,
} from '../../types'

const DRAWER_WIDTH = 240

const forEachAsync = async <T extends object>(
  array: T[],
  callback: (value: T, index: number, array: T[]) => Promise<void>
) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

export interface EditEntryModalProps {
  entries: DataGridModelRow[]
  selectionModel: GridSelectionModel
  updateDataEntry: (entry: DataGridModelRow) => void
  exit: () => void
}

export const EditEntryModal: React.FC<EditEntryModalProps> = ({
  entries,
  selectionModel,
  updateDataEntry,
  exit,
}) => {
  const [error, setError] = useState<string>('')
  const [dataEntry, setDataEntry] = useState<DataGridModelRow>()
  const [updatedRowIds, setUpdatedRowIds] = useState<number[]>([])

  const [mutateDataEntry] = useMutation<
    UpdateDataEntryResponse,
    UpdateDataEntryInput
  >(UpdateDataEntry)
  const [findFirstAccountMatchName] =
    useLazyQuery<FindFirstAccountMatchNameResult>(FindFirstAccountMatchName)

  const submitEntryUpdates = async () => {
    let errors: string[] = []

    await forEachAsync<DataGridModelRow>(entries, async (entry) => {
      if (!updatedRowIds.find((id) => entry.id === id)) return

      let donorAccountId = -1
      let recipientAccountId = -1

      try {
        const { data } = await findFirstAccountMatchName({
          variables: { name: entry.donorAccount },
        })

        if (data && data.findFirstAccountMatchName) {
          donorAccountId = data.findFirstAccountMatchName.accountId
        }
      } catch {
        errors.push(`Error finding donor account for ID="${entry.id}"`)
        return
      }

      try {
        const { data } = await findFirstAccountMatchName({
          variables: { name: entry.recipientAccount },
        })

        if (data && data.findFirstAccountMatchName) {
          recipientAccountId = data.findFirstAccountMatchName.accountId
        }
      } catch {
        errors.push(`Error finding recipient account for ID="${entry.id}"`)
        return
      }

      if (donorAccountId !== -1 && recipientAccountId !== -1) {
        const date = new Date()
        const { data } = await mutateDataEntry({
          variables: {
            entryId: entry.id,
            input: {
              modified: date,
              lifeCycleState: entry.lifeCycleState,
              serialNumber: entry.serialNumber,
              donorAccountId: donorAccountId,
              recipientAccountId: recipientAccountId,
            },
          },
        })

        if (
          !data ||
          !data.createDataEntry ||
          data.createDataEntry.success !== 'true'
        ) {
          errors.push(`Error updating entry ID="${entry.id}"`)
        } else {
          let updatedEntry = { ...dataEntry } as DataGridModelRow
          updatedEntry.modified = getDateStringFromISO(date.toISOString())
          updateDataGridRow(updatedEntry)
        }
      }
    })

    if (errors.length > 0) setError(errors.join('\r\n'))
  }

  const selectDataGridRow = (row?: GridRowId) => {
    if (row) {
      const rowId = row.valueOf()
      const entry = entries.find((value) => value.id === rowId)
      if (entry) setTimeout(() => setDataEntry(entry), 0)
    }
  }

  const updateDataGridRow = (row: DataGridModelRow) => {
    setTimeout(() => updateDataEntry(row), 0)
    setTimeout(() => setDataEntry(row), 0)
    if (!updatedRowIds.find((id) => row.id === id)) {
      setUpdatedRowIds([row.id, ...updatedRowIds])
    }
  }

  if (!dataEntry) selectDataGridRow(selectionModel.at(0))

  const saveThenExit = () => {
    submitEntryUpdates().finally(() => exit())
  }

  return (
    <Box sx={MODAL_BOX_STYLE}>
      <Center>
        <Typography variant='h4'>Edit Device Entries</Typography>
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
      <Box sx={{ display: 'flex' }}>
        <Box
          component='nav'
          sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
          <Drawer
            variant='permanent'
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: DRAWER_WIDTH,
              },
            }}
            open>
            <List>
              {selectionModel
                .sort(
                  (a, d) => (a.valueOf() as number) - (d.valueOf() as number)
                )
                .map((row, index) => {
                  const rowId = row.valueOf()
                  const entry = entries.find((value) => value.id === rowId)
                  if (entry) {
                    const label = `[${entry.id}]: ${entry.model}`
                    return (
                      <ListItemButton
                        key={index}
                        onClick={() => selectDataGridRow(row)}
                        selected={dataEntry && entry.id === dataEntry.id}>
                        <ListItemText primary={label} />
                      </ListItemButton>
                    )
                  }
                  return <div />
                })}
            </List>
          </Drawer>
        </Box>
        <Box
          component='main'
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          }}>
          {dataEntry && (
            <div>
              <Center>
                <FormControl sx={{ m: 1, width: '50ch' }} variant='outlined'>
                  <InputLabel id='lifecycle-select-label'>
                    Life-Cycle State
                  </InputLabel>
                  <Select
                    labelId='lifecycle-select-label'
                    id='lifecycle-select'
                    value={dataEntry.lifeCycleState}
                    defaultValue={LIFECYCLE_STATES.Pending}
                    label='LifeCycle State'
                    onChange={(event) => {
                      event.preventDefault()
                      let entry = { ...dataEntry }
                      let lcState = event.target.value as LifeCycleState
                      entry.lifeCycleState = lcState
                      updateDataGridRow(entry)
                    }}>
                    {Object.entries(LIFECYCLE_STATES).map(
                      ([key, value], index) => (
                        <MenuItem key={index} value={value}>
                          {key}
                        </MenuItem>
                      )
                    )}
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
                    value={dataEntry.serialNumber}
                    onChange={(event) => {
                      event.preventDefault()
                      let entry = { ...dataEntry }
                      entry.serialNumber = event.target.value.toUpperCase()
                      updateDataGridRow(entry)
                    }}
                    label='Serial Number'
                  />
                </FormControl>
              </Center>
              <Center>
                <FormControl sx={{ m: 1, width: '50ch' }} variant='outlined'>
                  <InputLabel htmlFor='donorAccount'>Donor Account</InputLabel>
                  <QuerySelect
                    apolloQuery={FindAllAccounts}
                    getQueryData={(data: FindAllAccountsResult) =>
                      data.findAllAccounts
                    }
                    getQueryDataValueLabel={(value: AccountQueryRow) =>
                      value.name
                    }
                    onDataSelected={(value: AccountQueryRow) => {
                      let entry = { ...dataEntry }
                      entry.donorAccount = value.name
                      updateDataGridRow(entry)
                    }}
                  />
                </FormControl>
              </Center>
              <Center>
                <FormControl sx={{ m: 1, width: '50ch' }} variant='outlined'>
                  <InputLabel htmlFor='donorAccount'>
                    Recipient Account
                  </InputLabel>
                  <QuerySelect
                    apolloQuery={FindAllAccounts}
                    getQueryData={(data: FindAllAccountsResult) =>
                      data.findAllAccounts
                    }
                    getQueryDataValueLabel={(value: AccountQueryRow) =>
                      value.name
                    }
                    onDataSelected={(value: AccountQueryRow) => {
                      let entry = { ...dataEntry }
                      entry.recipientAccount = value.name
                      updateDataGridRow(entry)
                    }}
                  />
                </FormControl>
              </Center>
              <div style={{ paddingTop: '5px' }} />
              <Center>
                <ButtonGroup sx={{ bottom: 0 }} variant='contained'>
                  <Button color='error' onClick={saveThenExit}>
                    Close Form
                  </Button>
                </ButtonGroup>
              </Center>
            </div>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default EditEntryModal

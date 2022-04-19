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
import { FindFirstAccountMatchName } from '../../modules/accounts'

import { LIFECYCLE_STATES, MODAL_BOX_STYLE } from './constants'
import { Center, ErrorMessage, QuerySelect } from '../../components'

import type {
  DataGridModelRow,
  FindFirstAccountMatchNameResult,
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

  const [mutateDataEntry] = useMutation<
    UpdateDataEntryResponse,
    UpdateDataEntryInput
  >(UpdateDataEntry)
  const [findFirstAccountMatchName] =
    useLazyQuery<FindFirstAccountMatchNameResult>(FindFirstAccountMatchName)

  const submitEntryUpdates = async () => {
    await forEachAsync<DataGridModelRow>(entries, async (entry) => {
      const donorAccountQuery = await findFirstAccountMatchName({
        variables: { name: entry.donorAccount },
      })
      const recipientAccountQuery = await findFirstAccountMatchName({
        variables: { name: entry.recipientAccount },
      })
    })
    return setError('Unknown error occured')
  }

  const selectDataEntry = (row?: GridRowId) => {
    if (row) {
      const rowId = row.valueOf()
      const entry = entries.find((value) => value.id === rowId)
      if (entry) setTimeout(() => setDataEntry(entry), 0)
    }
  }

  const updateDataGridRow = (row: DataGridModelRow) => {
    setTimeout(() => updateDataEntry(row), 0)
    setDataEntry(row)
  }

  if (!dataEntry) selectDataEntry(selectionModel.at(0))

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
              {selectionModel.map((row, index) => {
                const rowId = row.valueOf()
                const entry = entries.find((value) => value.id === rowId)
                if (entry) {
                  const label = `[${entry.id}]: ${entry.model}`
                  return (
                    <ListItemButton
                      key={index}
                      onClick={() => selectDataEntry(row)}
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
                <FormControl
                  required
                  sx={{ m: 1, width: '50ch' }}
                  variant='outlined'>
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
                      entry.lifeCycleState = event.target.value
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
                <FormControl
                  required
                  sx={{ m: 1, width: '50ch' }}
                  variant='outlined'>
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
              <div style={{ paddingTop: '5px' }} />
              <Center>
                <ButtonGroup sx={{ bottom: 0 }} variant='contained'>
                  <Button color='error' onClick={exit}>
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

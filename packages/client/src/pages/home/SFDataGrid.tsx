import React, { useState, Suspense } from 'react'
import { useQuery } from '@apollo/client'
import { DataGrid, GridSelectionModel } from '@mui/x-data-grid'
import { Button, ButtonGroup, Modal } from '@mui/material'

import { GRID_COLUMNS } from './constants'
import { useAppSelector } from '../../app/hooks'
import { Center, ErrorMessage } from '../../components'
import { FindAllDataEntriesInGridFormat } from '../../modules/entries'

import type {
  DataGridModelRow,
  FindAllDataEntriesInGridFormatResult,
} from '../../types'

const AddEntryModal = React.lazy(() => import('./AddEntryModal'))
const EditEntryModal = React.lazy(() => import('./EditEntryModal'))

const ROWS_PER_PAGE = 6

export const SFDataGrid: React.FC = () => {
  const session = useAppSelector((state) => state.user)

  const [addModalOpen, setAddModalOpen] = useState<boolean>(false)
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)

  const [entryRows, setEntryRows] = React.useState<DataGridModelRow[]>()
  const [selectedRows, setSelectedRows] = React.useState<GridSelectionModel>([])

  const { data, loading, error } =
    useQuery<FindAllDataEntriesInGridFormatResult>(
      FindAllDataEntriesInGridFormat
    )

  if (!session.user) return <div className='SF-data-grid-invalid' />
  if (loading) return <div className='SF-data-grid-loading' />
  if (error)
    return (
      <div className='SF-data-grid-error-query'>
        <Center>
          <ErrorMessage error='FATAL QUERY ERROR' variant='h3' />
        </Center>
        <Center>
          <ErrorMessage error={error.message} variant='subtitle2' />
        </Center>
      </div>
    )
  if (!data)
    return (
      <div className='SF-data-grid-error-nodata'>
        <Center>
          <ErrorMessage error='No data found' variant='subtitle2' />
        </Center>
      </div>
    )

  const getDateString = (isoString: string) => isoString.split('T')[0]

  if (!entryRows) {
    setEntryRows(
      data.findAllDataEntriesInGridFormat.map((value) => {
        const { entryId, modified, ...entry } = value
        return { id: entryId, modified: getDateString(modified), ...entry }
      })
    )
  }

  return (
    <div className='SF-data-grid-active'>
      {entryRows && (
        <div className='SF-data-grid-internal'>
          <ButtonGroup variant='text'>
            <Button onClick={() => setAddModalOpen(true)}>Add Data</Button>
            {session.user.isAdministrator && (
              <Button onClick={() => setEditModalOpen(selectedRows.length > 0)}>
                Edit Data
              </Button>
            )}
            {session.user.isAdministrator && (
              <Button onClick={() => setDeleteModalOpen(true)}>
                Delete Data
              </Button>
            )}
          </ButtonGroup>
          <Suspense fallback={<div />}>
            <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)}>
              <AddEntryModal exit={() => setAddModalOpen(false)} />
            </Modal>
            <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
              <EditEntryModal
                entries={entryRows}
                selectionModel={selectedRows}
                updateDataEntry={(entry) => {
                  setEntryRows(
                    entryRows.map((value) =>
                      value.id === entry.id ? entry : value
                    )
                  )
                }}
                exit={() => setEditModalOpen(false)}
              />
            </Modal>
            <Modal
              open={deleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}>
              <div />
            </Modal>
          </Suspense>
          <Center>
            <DataGrid
              checkboxSelection
              columns={GRID_COLUMNS}
              pageSize={ROWS_PER_PAGE}
              rows={entryRows}
              rowsPerPageOptions={[ROWS_PER_PAGE]}
              selectionModel={selectedRows}
              onSelectionModelChange={(selected) => setSelectedRows(selected)}
              sx={{ height: 450, width: 900 }}
            />
          </Center>
        </div>
      )}
    </div>
  )
}

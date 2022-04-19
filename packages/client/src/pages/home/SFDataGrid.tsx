import React, { useState, Suspense } from 'react'
import { useQuery } from '@apollo/client'
import { DataGrid } from '@mui/x-data-grid'
import { Button, ButtonGroup, Modal } from '@mui/material'

import { GRID_COLUMNS } from './constants'
import { useAppSelector } from '../../app/hooks'
import { Center, ErrorMessage } from '../../components'
import { FindAllDataEntriesInGridFormat } from '../../modules/entries'

import type { FindAllDataEntriesInGridFormatResult } from '../../types'

const AddEntryModal = React.lazy(() => import('./AddEntryModal'))
const EditEntryModal = React.lazy(() => import('./EditEntryModal'))
const DeleteEntryModal = React.lazy(() => import('./DeleteEntryModal'))

const ROWS_PER_PAGE = 10

export const SFDataGrid: React.FC = () => {
  const session = useAppSelector((state) => state.user)

  const [addModalOpen, setAddModalOpen] = useState<boolean>(false)
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)

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

  const closeAddModal = () => setAddModalOpen(false)
  const closeEditModal = () => setEditModalOpen(false)
  const closeDeleteModal = () => setDeleteModalOpen(false)

  const entryRows = data.findAllDataEntriesInGridFormat.map((value) => {
    const { modified, ...entry } = value
    return { modified: modified.toISOString(), ...entry }
  })

  return (
    <div className='SF-data-grid-active'>
      <Center>
        <ButtonGroup variant='text'>
          <Button onClick={() => setAddModalOpen(true)}>Add Data</Button>
          {session.user.isAdministrator && (
            <Button onClick={() => setEditModalOpen(true)}>Edit Data</Button>
          )}
          {session.user.isAdministrator && (
            <Button onClick={() => setDeleteModalOpen(true)}>
              Delete Data
            </Button>
          )}
        </ButtonGroup>
      </Center>
      <Suspense fallback={<div />}>
        <Modal open={addModalOpen} onClose={closeAddModal}>
          <AddEntryModal exit={closeAddModal} />
        </Modal>
        <Modal open={editModalOpen} onClose={closeEditModal}>
          <EditEntryModal exit={closeEditModal} />
        </Modal>
        <Modal open={deleteModalOpen} onClose={closeDeleteModal}>
          <DeleteEntryModal exit={closeDeleteModal} />
        </Modal>
      </Suspense>
      <Center>
        <DataGrid
          checkboxSelection
          columns={GRID_COLUMNS}
          pageSize={ROWS_PER_PAGE}
          rows={entryRows}
          rowsPerPageOptions={[ROWS_PER_PAGE]}
          sx={{ height: 550, width: 900 }}
        />
      </Center>
    </div>
  )
}

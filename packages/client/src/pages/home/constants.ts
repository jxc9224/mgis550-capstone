import { LifeCycleState } from '../../types/shared'

export const MODAL_BOX_STYLE = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70ch',
  maxHeight: '70ch',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'block',
  overflow: 'scroll',
}

export const NEW_ITEM_MARKER = '__new_query_item'

export const LIFECYCLE_STATES: {
  [key: string]: LifeCycleState
} = {
  Pending: 'PENDING',
  Received: 'RECEIVED',
  Problem: 'PROBLEM',
  Distributed: 'DISTRIBUTED',
  'E-Waste (Scrapped)': 'EWASTE',
}

export const GRID_COLUMNS = [
  {
    field: 'id',
    headerName: 'ID',
    width: 95,
  },
  {
    field: 'productName',
    headerName: 'Product Type',
    width: 130,
  },
  {
    field: 'manufacturer',
    headerName: 'Manufacturer',
    width: 130,
  },
  {
    field: 'model',
    headerName: 'Model',
    width: 225,
  },
  {
    field: 'lifeCycleState',
    headerName: 'LifeCycle Status',
    width: 145,
  },
  {
    field: 'modified',
    headerName: 'Last Updated',
    width: 160,
  },
  {
    field: 'donorAccount',
    headerName: 'Donor Account',
    width: 175,
  },
  {
    field: 'recipientAccount',
    headerName: 'Recipient Account',
    width: 175,
  },
  {
    field: 'serialNumber',
    headerName: 'Serial Number',
    width: 160,
  },
]

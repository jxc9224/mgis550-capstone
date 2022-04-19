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

export const GRID_COLUMNS = [
  {
    field: 'entryId',
    headerName: 'ID Tag',
    width: 70,
  },
  {
    field: 'productName',
    headerName: 'Product',
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
    width: 260,
  },
  {
    field: 'lifeCycleState',
    headerName: 'LC Status',
    width: 130,
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
]

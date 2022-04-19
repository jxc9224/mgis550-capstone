import React, { Suspense } from 'react'
import { Divider, Paper, Typography } from '@mui/material'

import { useAppSelector } from '../../app/hooks'
import { Center, NavBar } from '../../components'
import { SFDataGrid } from './SFDataGrid'

export const HomePage: React.FC = () => {
  const session = useAppSelector((state) => state.user)
  return (
    <div className='Home-page'>
      <div style={{ paddingTop: '20px' }} />
      <Center>
        <Typography variant='h3'>The Shore Foundation</Typography>
      </Center>
      <div style={{ padding: '5px' }} />
      <Center>
        <Typography variant='h5'>Data Management System - Dashboard</Typography>
      </Center>
      <div style={{ paddingTop: '10px' }} />
      <NavBar />
      <div style={{ padding: '10px' }}>
        <Divider />
      </div>
      <Suspense fallback={<div />}>
        <Center>
          <Paper sx={{ width: '170ch' }} elevation={8}>
            {!session.user ? (
              <div className='SF-data-grid-inactive' />
            ) : (
              <SFDataGrid />
            )}
          </Paper>
        </Center>
      </Suspense>
    </div>
  )
}

export default HomePage

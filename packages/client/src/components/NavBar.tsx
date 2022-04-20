/**
 * @author John Carr <jxc9224@rit.edu>
 * @license MIT
 */

import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, ButtonGroup } from '@mui/material'

import { useAppSelector, useLogout } from '../app/hooks'
import { Center } from './Center'

export const SFDataGrid: React.FC = () => {
  return <div className='SF-data-grid-active'></div>
}

export const NavBar: React.FC = () => {
  const logout = useLogout()
  const navigate = useNavigate()
  const session = useAppSelector((state) => state.user)

  useEffect(() => {
    if (!session.user) navigate('/login')
  })

  /*
   <Button onClick={() => navigate('/audit')}>Audit Log</Button>
    {session.user?.isAdministrator && (
      <Button onClick={() => navigate('/admin')}>Admin Panel</Button>
    )}
   */

  return (
    <div className='Nav-bar'>
      <Center>
        <ButtonGroup variant='text'>
          <Button onClick={() => navigate('/')}>Home</Button>
          <Button onClick={logout}>Logout</Button>
        </ButtonGroup>
      </Center>
    </div>
  )
}

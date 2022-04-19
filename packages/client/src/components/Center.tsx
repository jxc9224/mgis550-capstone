import React, { ReactNode } from 'react'
import { Box } from '@mui/material'

export interface CenterProps {
  children?: null | ReactNode | ReactNode[]
}

export const Center: React.FC<CenterProps> = ({ children }) => {
  return (
    <Box className='Center' sx={{ display: 'flex', justifyContent: 'center' }}>
      {children}
    </Box>
  )
}

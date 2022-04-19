import React from 'react'
import { Typography, TypographyProps } from '@mui/material'

export interface ErrorMessageProps extends TypographyProps {
  error: string
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  ...props
}) => {
  return (
    <Typography style={{ color: 'red' }} {...props}>
      {`Error: ${error}`}
    </Typography>
  )
}

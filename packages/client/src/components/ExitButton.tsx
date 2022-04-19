import React from 'react'
import { styled, Theme } from '@mui/material/styles'
import { IconButton, IconButtonProps } from '@mui/material'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'

export interface ExitButtonOptions {
  enabled: boolean
  theme: Theme
}

export interface ExitButtonProps extends IconButtonProps {
  doExit: React.MouseEventHandler<HTMLButtonElement>
}

export const ExitButton = styled((props: ExitButtonProps) => {
  const { doExit, ...iconButtonProps } = props
  return (
    <IconButton onClick={doExit} {...iconButtonProps}>
      <CancelOutlinedIcon />
    </IconButton>
  )
})(({ theme, enabled }: ExitButtonOptions) => ({
  transform: !enabled ? 'rotate(0deg)' : 'rotate(180deg)',
  marginRight: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))

export default ExitButton

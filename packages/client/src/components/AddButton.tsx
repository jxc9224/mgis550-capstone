import React from 'react'
import { IconButton, IconButtonProps } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { styled, Theme } from '@mui/material/styles'

export interface AddButtonOptions {
  enabled: boolean
  theme: Theme
}

export interface AddButtonProps extends IconButtonProps {
  enabled: boolean
}

export const AddButton: React.FC<AddButtonProps> = styled(
  (props: AddButtonProps) => {
    const { enabled, ...iconButtonProps } = props
    return (
      <IconButton {...iconButtonProps}>
        <AddIcon color={enabled ? 'primary' : 'disabled'} />
      </IconButton>
    )
  }
)(({ theme, enabled }: AddButtonOptions) => ({
  transform: !enabled ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))

export default AddButton

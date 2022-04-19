import React, { ReactNode } from 'react'
import { IconButton, IconButtonProps } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { styled, Theme } from '@mui/material/styles'

export interface ExpandButtonOptions {
  expand: boolean
  theme: Theme
}

export interface ExpandButtonProps extends IconButtonProps {
  expand: boolean
  children?: null | ReactNode | ReactNode[] // required for use with React.lazy
}

export const ExpandButton: React.FC<ExpandButtonProps> = styled(
  (props: ExpandButtonProps) => {
    const { expand, ...iconButtonProps } = props
    return (
      <IconButton {...iconButtonProps}>
        <ExpandMoreIcon />
      </IconButton>
    )
  }
)(({ theme, expand }: ExpandButtonOptions) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))

export default ExpandButton

import { IconButton, IconButtonProps } from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove'
import { styled, Theme } from '@mui/material/styles'

export interface RemoveButtonOptions {
  enabled: boolean
  theme: Theme
}

export interface RemoveButtonProps extends IconButtonProps {
  enabled: boolean
}

export const RemoveButton: React.FC<RemoveButtonProps> = styled(
  (props: RemoveButtonProps) => {
    const { enabled, ...iconButtonProps } = props
    return (
      <IconButton {...iconButtonProps}>
        <RemoveIcon color={enabled ? 'primary' : 'disabled'} />
      </IconButton>
    )
  }
)(({ theme, enabled }: RemoveButtonOptions) => ({
  transform: !enabled ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))

export default RemoveButton

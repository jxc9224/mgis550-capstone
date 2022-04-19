import React, { useState } from 'react'
import { TextField, StandardTextFieldProps } from '@mui/material'
import { styled, Theme } from '@mui/material/styles'

import AddButton from './AddButton'
import RemoveButton from './RemoveButton'

export interface QuantityFieldOptions {
  enabled: boolean
  theme: Theme
}

export interface QuantityFieldProps extends StandardTextFieldProps {
  enabled: boolean
  maxQuantity: number
  quantityChanged: any
}

export const QuantityField = styled((props: QuantityFieldProps) => {
  const { enabled, maxQuantity, quantityChanged, ...textFieldProps } = props
  const [quantity, setQuantity] = useState(0)

  const updateQuantity = (desiredQuantity: number): void => {
    props.quantityChanged(desiredQuantity)
    setQuantity(desiredQuantity)
  }

  return (
    <div className='Quantity-field'>
      <AddButton
        enabled={quantity === maxQuantity ? false : enabled}
        onClick={() => updateQuantity(Math.min(maxQuantity, quantity + 1))}
      />
      <TextField
        defaultValue={0}
        disabled={!enabled}
        value={quantity}
        onChange={(event) => {
          let desiredQuantity: number = parseFloat(event.target.value)
          // ~~ => double bitwise NOT => chop off decimal
          desiredQuantity = isNaN(desiredQuantity) ? 0 : ~~desiredQuantity
          //setTimeout(() => props.quantityChanged(desiredQuantity), 0)
          updateQuantity(desiredQuantity)
        }}
        {...textFieldProps}
      />
      <RemoveButton
        enabled={quantity === 0 ? false : enabled}
        onClick={() => updateQuantity(Math.max(0, quantity - 1))}
      />
    </div>
  )
})(({ theme, enabled }: QuantityFieldOptions) => ({
  marginLeft: 'auto',
}))

export default QuantityField

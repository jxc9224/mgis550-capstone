import React, { useState } from 'react'
import { Autocomplete } from '@mui/lab'
import { OutlinedInput, OutlinedInputProps } from '@mui/material'
import { DocumentNode, useQuery } from '@apollo/client'

export interface QueryInputProps {
  apolloQuery: DocumentNode
  inputProps: OutlinedInputProps
  getOptionLabel: (option: any) => string
  getQueryData: (data: any) => readonly any[] | undefined
  setOptionValue: (option: any, setValue: React.Dispatch<any>) => void
  onQueryFail: () => void
}

export const QueryInput: React.FC<QueryInputProps> = ({
  apolloQuery,
  inputProps,
  getOptionLabel,
  setOptionValue,
  getQueryData,
  onQueryFail,
}) => {
  const [selectedValue, SetSelectedValue] = useState('')
  const { data, loading, error } = useQuery(apolloQuery)

  const failure: React.FC<OutlinedInputProps> = (props) => {
    setTimeout(() => onQueryFail(), 0)
    return <OutlinedInput {...props} />
  }

  if (loading) return <div />
  if (error || !data) return failure(inputProps)

  const options = getQueryData(data)
  if (!options) return failure(inputProps)

  return (
    <Autocomplete
      options={options}
      getOptionLabel={getOptionLabel}
      onChange={(_, option) => setOptionValue(option, SetSelectedValue)}
      inputValue={selectedValue}
      style={{ width: 300 }}
      renderInput={(params) => <OutlinedInput {...params} {...inputProps} />}
    />
  )
}

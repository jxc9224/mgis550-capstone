import React from 'react'
import { Select, MenuItem } from '@mui/material'
import { DocumentNode, useQuery } from '@apollo/client'

export interface QuerySelectProps {
  apolloQuery: DocumentNode
  defaultValue: string | number | readonly string[]
  getQueryData: (data: any) => any[] | undefined
  getQueryDataValueLabel: (value: any) => string
  onDataSelected: (value?: any) => void
  onQueryFail: () => void
}

export const QuerySelect: React.FC<QuerySelectProps> = ({
  apolloQuery,
  defaultValue,
  getQueryData,
  getQueryDataValueLabel,
  onDataSelected,
  onQueryFail,
}) => {
  const { data, loading, error } = useQuery(apolloQuery)

  if (loading) return <div />
  if (error || !data) return <div />

  const queryData = data !== undefined && getQueryData(data)
  if (!queryData) {
    onQueryFail()
    return (
      <Select onChange={(event) => selectData(event.target.value)}>
        <MenuItem key={0} value={defaultValue}>
          Add new...
        </MenuItem>
      </Select>
    )
  }

  const selectData = (value: any) => {
    if (value !== defaultValue) {
      onDataSelected(queryData.at(value))
    } else {
      onDataSelected(defaultValue)
    }
  }

  return (
    <Select onChange={(event) => selectData(event.target.value)}>
      <MenuItem key={0} value={defaultValue}>
        Add new...
      </MenuItem>
      {queryData.map((value, index) => {
        return (
          <MenuItem key={index + 1} value={index}>
            {getQueryDataValueLabel(value)}
          </MenuItem>
        )
      })}
    </Select>
  )
}

/**
 * @author John Carr <jxc9224@rit.edu>
 * @license MIT
 */

import React from 'react'
import { Select, MenuItem } from '@mui/material'
import { DocumentNode, useQuery } from '@apollo/client'

const ADD_NEW_LABEL = `Add new...`
const NO_RESULTS_LABEL = `No results`

export interface QuerySelectProps {
  apolloQuery: DocumentNode
  defaultValue?: string | number | readonly string[]
  defaultValueLabel?: string
  noResultsLabel?: string
  getQueryData: (data: any) => any[] | undefined
  getQueryDataValueLabel: (value: any) => string
  onDataSelected: (value?: any) => void
  onQueryFail?: () => void
}

export const QuerySelect: React.FC<QuerySelectProps> = ({
  apolloQuery,
  getQueryData,
  getQueryDataValueLabel,
  onDataSelected,
  defaultValue,
  defaultValueLabel,
  noResultsLabel,
  onQueryFail,
}) => {
  const { data, loading, error } = useQuery(apolloQuery)

  if (loading) return <div />
  if (error || !data) return <div />

  const queryData = data !== undefined && getQueryData(data)
  if (!queryData) {
    if (onQueryFail) onQueryFail()
    return (
      <Select onChange={(event) => selectData(event.target.value)}>
        <MenuItem key={0} value={defaultValue}>
          {defaultValue
            ? defaultValueLabel || ADD_NEW_LABEL
            : noResultsLabel || NO_RESULTS_LABEL}
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
      {defaultValue && (
        <MenuItem key={0} value={defaultValue}>
          {defaultValueLabel || ADD_NEW_LABEL}
        </MenuItem>
      )}
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

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { UserState, UserLoginState } from '../types'

const initialState: UserLoginState = {}

type UserLoginAction = PayloadAction<UserState>

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    login: (state: UserLoginState, { payload }: UserLoginAction) => {
      state.user = payload
    },
    logout: (state: UserLoginState) => {
      state.user = undefined
    },
  },
})

export const userReducer = userSlice.reducer

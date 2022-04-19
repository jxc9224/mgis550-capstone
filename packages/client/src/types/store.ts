import { ThunkAction, Action } from '@reduxjs/toolkit'
import store from '../state'

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

export interface UserState {
  userId: number
  email: string
  password: string
  isAdministrator: boolean
}

export interface UserLoginState {
  user?: UserState
}


import { useLazyQuery, useMutation } from '@apollo/client'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import { CreateUser, FindUserUsingLogin } from '../modules/users'
import type {
  AppDispatch,
  BaseResponse,
  FindUserUsingLoginResult,
  LoginDispatch,
  LogoutDispatch,
  RegisterDispatch,
  RootState,
  UserState,
} from '../types'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useLogin = (): LoginDispatch => {
  const dispatch = useAppDispatch()
  const [findUserUsingLogin] =
    useLazyQuery<FindUserUsingLoginResult>(FindUserUsingLogin)

  return async (email, password) => {
    let { data, loading, error } = await findUserUsingLogin({
      variables: { email: email, password: password },
    })

    if (data && data.findUserUsingLogin) {
      dispatch({
        type: 'user/login',
        payload: { ...data.findUserUsingLogin } as UserState,
      })

      return { success: true, loading: loading, error: error?.message }
    }

    return { success: false, loading: loading, error: error?.message }
  }
}

export const useLogout = (): LogoutDispatch => {
  const dispatch = useAppDispatch()
  return () => dispatch({ type: 'user/logout' })
}

export const useRegister = (loginAfter: boolean = false): RegisterDispatch => {
  const login = useLogin()
  const [createUser, { loading, error, reset }] =
    useMutation<BaseResponse>(CreateUser)

  return async (email, password) => {
    const { data } = await createUser({
      variables: {
        email: email,
        password: password,
      },
    })

    if (data && data.success === 'true') {
      if (loginAfter) await login(email, password)

      return { success: true, loading: loading, reset: reset, error: undefined }
    }

    return {
      success: false,
      loading: loading,
      reset: reset,
      error: error?.message || (data && data.errors?.join(', ')),
    }
  }
}


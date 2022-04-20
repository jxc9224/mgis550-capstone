/**
 * @author John Carr <jxc9224@rit.edu>
 * @license MIT
 */

export type DispatchResetFunction = () => void

export type LoginDispatch = (
  email: string,
  password: string
) => Promise<{
  success: Boolean
  loading: Boolean
  error: string | null | undefined
}>

export type LogoutDispatch = () => void

export type RegisterDispatch = (
  email: string,
  password: string
) => Promise<{
  success: Boolean
  loading: Boolean
  reset: DispatchResetFunction
  error: string | null | undefined
}>

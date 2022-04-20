/**
 * @author John Carr <jxc9224@rit.edu>
 * @license MIT
 */

import { configureStore } from '@reduxjs/toolkit'
import { userReducer } from './user'

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
})

export default store

import React, { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Loading } from './components'

const Admin = React.lazy(() => import('./pages/admin'))
const Home = React.lazy(() => import('./pages/home'))
const Login = React.lazy(() => import('./pages/login'))

export const Router: React.FC = () => {
  return (
    <div className='App-router'>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path='/'>
              <Route index element={<Home />} />
              <Route path='login'>
                <Route index element={<Login />} />
              </Route>
              <Route path='admin'>
                <Route index element={<Admin />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  )
}

export default Router


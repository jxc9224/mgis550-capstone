import React, { useEffect, useState, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  OutlinedInput,
  Paper,
  Typography,
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'

import { useAppSelector, useLogin } from '../../app/hooks'
import { Center, ErrorMessage } from '../../components'

const SendIcon = React.lazy(() => import('@mui/icons-material/Send'))

const MIN_EMAIL_LENGTH = 6
const MIN_PASSWORD_LENGTH = 8
const REGEX_EMAIL_VALIDATE =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const validateEmail = (email: string): boolean => {
  if (email === '' || email.length < MIN_EMAIL_LENGTH) return false
  return REGEX_EMAIL_VALIDATE.test(email)
}

const validatePassword = (password: string): boolean => {
  if (password === '' || password.length < MIN_PASSWORD_LENGTH) return false
  return true
}

export const LoginPage: React.FC = () => {
  const login = useLogin()
  const navigate = useNavigate()
  const session = useAppSelector((state) => state.user)

  const [error, setError] = useState<string>('')
  const [inputEmail, setInputEmail] = useState<string>('')
  const [inputPassword, setInputPassword] = useState<string>('')

  const [loginLoading, setLoginLoading] = useState<boolean>(false)
  const [rememberMeChecked, setRememberMeChecked] = useState<boolean>(false)

  // if user's already logged in, redirect to home page
  useEffect(() => {
    if (session.user) navigate('/')
  })

  // this is to maintain security integrity
  // *totally* not just to deliberately annoy the end-user
  const setErrClrPasswd = (error: string) => {
    setTimeout(() => setInputPassword(''), 0)
    setError(error)
  }

  // check if email/password is valid -> submit request
  // useEffect navigates on successful attempt
  const loginSubmit = () => {
    if (!validateEmail(inputEmail)) {
      return setErrClrPasswd('Invalid email')
    } else if (!validatePassword(inputPassword)) {
      return setErrClrPasswd('Invalid password')
    }

    login(inputEmail, inputPassword).then(({ success, loading, error }) => {
      if (!loading && !success) {
        setTimeout(() => setErrClrPasswd(error || 'Invalid credentials'), 0)
        setLoginLoading(false)
      }
    })

    setLoginLoading(true)
  }

  return (
    <div className='Login-page'>
      <div style={{ paddingTop: '20px' }} />
      <Center>
        <Typography variant='h3'>The Shore Foundation</Typography>
      </Center>
      <div style={{ padding: '5px' }} />
      <Center>
        <Typography variant='h5'>Data Management System - Login</Typography>
      </Center>
      <div style={{ paddingBottom: '25px' }} />
      <Container>
        <Suspense fallback={<div />}>
          <Center>
            <Paper sx={{ width: '50ch' }} elevation={8}>
              <div style={{ paddingTop: '10px' }} />
              {error !== '' && (
                <div className='Login-error'>
                  <Center>
                    <ErrorMessage error={error} variant='h6' />
                  </Center>
                  <div style={{ paddingBottom: '5px' }} />
                </div>
              )}
              <Center>
                <FormControl sx={{ m: 1, width: '50ch' }} variant='outlined'>
                  <InputLabel htmlFor='email'>Email</InputLabel>
                  <OutlinedInput
                    fullWidth
                    id='email'
                    type='text'
                    value={inputEmail}
                    onChange={(event) => {
                      event.preventDefault()
                      setInputEmail(event.target.value)
                    }}
                    label='Email'
                  />
                </FormControl>
              </Center>
              <Center>
                <FormControl sx={{ m: 1, width: '50ch' }} variant='outlined'>
                  <InputLabel htmlFor='password'>Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    id='password'
                    type='password'
                    value={inputPassword}
                    onChange={(event) => {
                      event.preventDefault()
                      setInputPassword(event.target.value)
                    }}
                    label='Password'
                  />
                </FormControl>
              </Center>
              <Center>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMeChecked}
                      onChange={(event) =>
                        setRememberMeChecked(event.target.checked)
                      }
                    />
                  }
                  label='Remember me'
                />
              </Center>
              <div style={{ paddingTop: '10px' }} />
              <Center>
                <LoadingButton
                  endIcon={<SendIcon />}
                  loading={loginLoading}
                  loadingPosition='end'
                  variant='contained'
                  onClick={loginSubmit}>
                  Login
                </LoadingButton>
              </Center>
              <div style={{ paddingBottom: '20px' }} />
            </Paper>
          </Center>
        </Suspense>
      </Container>
    </div>
  )
}

export default LoginPage

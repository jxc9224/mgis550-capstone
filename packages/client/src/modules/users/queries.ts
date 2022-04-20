/**
 * @author John Carr <jxc9224@rit.edu>
 * @license MIT
 */

import { gql } from '@apollo/client'

export const FindAllUsers = gql`
  query FindAllUsers {
    findAllUsers {
      userId
      email
      password
      isAdministrator
    }
  }
`

export const FindUserById = gql`
  query FindUserById($userId: ID!) {
    findUserById(userId: $userId) {
      userId
      email
      password
      isAdministrator
    }
  }
`

export const FindUserUsingLogin = gql`
  query FindUserUsingLogin($email: String!, $password: String!) {
    findUserUsingLogin(email: $email, password: $password) {
      userId
      email
      password
      isAdministrator
    }
  }
`

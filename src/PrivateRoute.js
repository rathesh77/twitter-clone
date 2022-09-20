import {Navigate} from 'react-router-dom'
import React from 'react'
import { useContext } from 'react'
import AuthContext from './authContext'
export default function PrivateRoute({Component, shouldBeAuthenticated, ...rest}) {
  const auth = useContext(AuthContext)
  console.log(auth)
  if (shouldBeAuthenticated === false) {
    if (auth.userId != null) {
      return <Navigate to="/"/>
    }
  }
  return (<Component {...rest}></Component>)
}
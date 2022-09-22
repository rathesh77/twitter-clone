import {Navigate} from 'react-router-dom'
import React from 'react'
import { useContext } from 'react'
import AuthContext from './authContext'
import Login from './components/LoginScreen/login'
export default function PrivateRoute({Component, shouldBeAuthenticated, ...rest}) {
  const auth = useContext(AuthContext)

  if (shouldBeAuthenticated === false) {
    if (auth.userId != null) {
      return <Navigate to="/"/>
    }
  } else {
    if (auth.userId == null) {
       return <Login/>
    }
  }

  return (<Component {...rest}></Component>)
}
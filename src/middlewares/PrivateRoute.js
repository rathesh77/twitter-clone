import {Navigate} from 'react-router-dom'
import React from 'react'
import { useContext } from 'react'
import AuthContext from '../authContext'
import Login from '../pages/Login'
export default function PrivateRoute({Component, shouldBeAuthenticated, ...rest}) {
  const auth = useContext(AuthContext)
  if (shouldBeAuthenticated === false) {
    if (auth.user != null) {
      return <Navigate to="/"/>
    }
  } else {
    if (auth.user == null) {
       return <Login/>
    }
  }

  return (<Component {...rest}></Component>)
}
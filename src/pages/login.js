import { useContext, useState } from "react"
import { TextField } from '@mui/material'
import { useNavigate } from "react-router-dom";

import AuthContext from "../authContext";
import { login } from "../services/User";

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate();
  const {setUser} = useContext(AuthContext)
  
  const handleLogin = async () => {
    const data = {email, password}
    const response = await login(data)
    if (response) {
      setUser(response)
      return navigate('/')
    }
  }

  const handleEmail = (e) => {
    const value = e.target.value
    setEmail(value)
  }

  const handlePassword = (e) => {
    const value = e.target.value
    setPassword(value)
  }

  return (
    <div className="login-wrapper">

      <div className="login-image">
      </div>
      <div className="login-credentials-wrapper">
        <div className="logo"></div>
        <div className="h1-header">Ça se passe maintenant</div>
        <div className="h2-header">Rejoignez Twitter dès aujourd'hui.</div>
        <div className="login-credentials">
          <TextField onChange={handleEmail} className="outlined-basic" label="Email" variant="outlined" />
          <TextField onChange={handlePassword} className="outlined-basic" label="Mot de passe" variant="outlined" />
          <button type="button" className="btn" onClick={handleLogin}>Se connecter</button>

        </div>

      </div>
    </div>
  )
}
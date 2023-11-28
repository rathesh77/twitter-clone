
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './App.css';
import Main from './layout/index.js'
import Login from './pages/login'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './middlewares/PrivateRoute';
import AuthContext from './authContext'
import { useEffect, useState } from 'react'

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { blueGrey, common, grey } from '@mui/material/colors';

import {fetchMe} from './services/userServices.js'
import { socket } from './socket';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: blueGrey,
    divider: grey,
    background: {
      default: common.black,
      
    }
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});


function MainComponent() {
  return (<div className="App"><Main /></div>)
}

function App() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true);


  const getMe = async () => {
    const user = await fetchMe()
    if (user) {
      console.log(user)
      setUser({...user})
    }
    setIsLoading(false)
    
  }

  useEffect(() => {
    if (user == null)
      getMe()
    
    if (user)
      socket.connect()
    else if (socket.conected)
      socket.disconnect()
    
  }, [user])


  if (isLoading) {
    return (<div>LOADING</div>)
  }
  console.log('REFRESH APP')
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />

    <AuthContext.Provider value={{user, setUser, getMe }}>
      <Router>
        <Routes>
          <Route element={<PrivateRoute Component={Login} shouldBeAuthenticated={false} />} path='/login' />
          <Route index element={(<PrivateRoute Component={MainComponent} shouldBeAuthenticated={true} />)} path='*' />
        </Routes>
      </Router>
    </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;


import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './App.css';
import Main from './components/Main'
import Login from './components/LoginScreen/login'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AuthContext from './authContext'
import { useEffect, useState } from 'react'
import { axiosInstance } from './axios';

function MainComponent() {
  return (<div className="App"><Main /></div>)
}

function App() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true);

  const getMe = async () => {
    try {
      const response = await axiosInstance.get('/me')
      if (response.status === 200) {
        const { data } = response
        setUser(data)
      }
    } catch (e) {

    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {

    if (user == null) {
      getMe()
    }
  }, [user])
  if (isLoading) {
    return (<div>LOADING</div>)
  }
  return (
    <AuthContext.Provider value={{user, setUser }}>
      <Router>
        <Routes>
          <Route element={<PrivateRoute Component={Login} shouldBeAuthenticated={false} />} path='/login' />
          <Route element={(<PrivateRoute Component={MainComponent} shouldBeAuthenticated={true} />)} path='/*' />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;

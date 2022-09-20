
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './App.css';
import Main from './components/Main'
import Login from './components/Main/LoginScreen/login'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AuthContext from './authContext'

function App() {
  return (
    <AuthContext.Provider value={{userId: 'test'}}>
      <Router>
        <Routes>
            <Route element={(<PrivateRoute Component={Login} shouldBeAuthenticated={false} />)} path='/login'/>
            <Route index={true} path='/*' element={(<div className="App"><Main/></div>)}/>
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;

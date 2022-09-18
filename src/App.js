import './App.css';
import Main from './components/Main'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { BrowserRouter as Router} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Main/>
      </div>
    </Router>
  );
}

export default App;

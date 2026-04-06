
import {Routes, Route } from 'react-router-dom';
import MainPanel from './MainPanel';
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';

function App() {

  return(
    <div>
      <Routes>
        <Route path='/' element={<LoginPage />}></Route>
         <Route path='/main-panel' element={<MainPanel />}></Route>
        <Route path='/register' element={<RegisterPage />}></Route>
        
      </Routes>
    </div>
  )
}

export default App;
import './App.css';
import { Routes, Route } from 'react-router-dom';

// components
import Home from './components/Home'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import PageNotFound from './components/PageNotFound'


function App() {
  return (
    <div className="App h-[100vh]  flex justify-center items-center">
     <Routes >
        <Route path='/' element={<Home />} />
        <Route path='/signin' element={<SignIn/>} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/forgot-password' element={< ForgotPassword/>} />
        <Route path='/reset-password/:resetPasswordToken' element={< ResetPassword/>} />
        <Route path='*' element={<PageNotFound />} />
     </Routes>
    </div>
  );
}

export default App;

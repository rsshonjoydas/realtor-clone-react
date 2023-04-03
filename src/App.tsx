import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Login from './pages/Login';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/offers' element={<Offers />} />
      </Routes>
    </Router>
  );
}

export default App;

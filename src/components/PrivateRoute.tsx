import { Navigate, Outlet } from 'react-router-dom';
import { AuthStatus, useAuthStatus } from '../hooks/useAuthStatus';
import Spinner from './Spinner';

const PrivateRoute = () => {
  const { loggedIn, checkingStatus }: AuthStatus = useAuthStatus();

  if (checkingStatus) return <Spinner />;

  return loggedIn ? <Outlet /> : <Navigate to='/login' />;
};

export default PrivateRoute;

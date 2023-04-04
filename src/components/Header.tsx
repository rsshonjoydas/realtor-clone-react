import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const [pageState, setPageState] = useState('login');
  const location = useLocation();
  const navigate = useNavigate();

  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPageState('Profile');
      } else {
        setPageState('Login');
      }
    });
  }, [auth]);

  const pathMatchRoute = (route: string): boolean => {
    if (route === location.pathname) {
      return true;
    }
    return false;
  };

  return (
    <div className='sticky top-0 z-40 bg-white border-b shadow-sm'>
      <header className='flex items-center justify-between max-w-6xl px-3 mx-auto'>
        <div>
          <img
            src='logo.svg'
            alt='logo'
            className='h-5 cursor-pointer'
            onClick={() => navigate('/')}
          />
        </div>
        <div>
          <ul className='flex space-x-10'>
            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 ${
                pathMatchRoute('/') && 'text-gray-600 border-b-[3px] border-b-red-500'
              }`}
              onClick={() => navigate('/')}
            >
              Home
            </li>
            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 ${
                pathMatchRoute('/offers') && 'text-gray-600 border-b-[3px] border-b-red-500'
              }`}
              onClick={() => navigate('/offers')}
            >
              Offers
            </li>
            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 ${
                (pathMatchRoute('/login') || pathMatchRoute('/profile')) &&
                'text-gray-600 border-b-[3px] border-b-red-500'
              }`}
              onClick={() => navigate('/profile')}
            >
              {pageState}
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
};

export default Header;

import { useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathMatchRoute = (route: string): boolean => {
    if (route === location.pathname) {
      return true;
    }
    return false;
  };

  return (
    <div className='bg-white border-b shadow-sm sticky top-0 z-40'>
      <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
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
                pathMatchRoute('/login') && 'text-gray-600 border-b-[3px] border-b-red-500'
              }`}
              onClick={() => navigate('/login')}
            >
              Login
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
};

export default Header;

import { FcGoogle } from 'react-icons/fc';

const OAuth = () => (
  <button
    type='button'
    className='flex items-center justify-center w-full py-3 text-sm font-medium text-white uppercase transition duration-150 ease-in-out bg-red-600 rounded shadow-md px-7 hover:bg-red-700 active:bg-red-800 hover:shadow-lg active:shadow-lg'
  >
    <FcGoogle className='mr-2 text-2xl bg-red-300 rounded-full' />
    Continue with Google
  </button>
);

export default OAuth;

import { getAuth } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: auth.currentUser?.displayName || '',
    email: auth.currentUser?.email || '',
  });
  const { name, email } = formData;

  console.log(setFormData);

  const logout = () => {
    auth.signOut();

    navigate('/');
  };

  return (
    <section className='flex flex-col items-center justify-center max-w-6xl mx-auto'>
      <h1 className='mt-6 text-3xl font-bold text-center'>My Profile</h1>
      <div className='w-full md:w-[50%] mt-6 px-3 '>
        <form>
          <input
            type='text'
            name='name'
            id='name'
            value={name}
            disabled
            className='w-full px-4 py-2 mb-6 text-xl text-gray-700 transition ease-in-out bg-white border border-gray-300 rounded'
          />
          <input
            type='text'
            name='email'
            id='email'
            value={email}
            disabled
            className='w-full px-4 py-2 mb-6 text-xl text-gray-700 transition ease-in-out bg-white border border-gray-300 roundedmb-6 '
          />

          <div className='flex justify-between text-sm sm:text-lg whitespace-nowrap'>
            <p className='flex items-center'>
              Do you want to change your name?
              <span className='ml-1 text-red-500 transition duration-200 ease-in-out cursor-pointer hover:text-red-600'>
                Edit
              </span>
            </p>
            <p
              onClick={logout}
              className='text-blue-500 transition duration-200 ease-in-out cursor-pointer hover:text-blue-600'
            >
              Sign Out
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Profile;

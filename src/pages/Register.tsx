import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import OAuth from '../components/OAuth';
import { firestore } from '../config/firebase';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const { name, email, password } = formData;

  const navigate = useNavigate();

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const { user } = userCredential;
      if (!user) {
        throw new Error('User not found');
      }

      if (name) {
        await updateProfile(user, {
          displayName: name,
        });
      }

      const formDataCopy = {
        ...formData,
        timestamp: serverTimestamp(),
        password: undefined, // ? set password to undefined instead of deleting it
      };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp(); // ? use the timestamp property

      await setDoc(doc(firestore, 'users', user.uid), formDataCopy);
      toast.success('Sign up was successful');
      navigate('/');
    } catch (error) {
      console.log('🚀 ~ file: Register.tsx:49 ~ onSubmit ~ error:', error);
      toast.error('Something went wrong with the registration');
    }
  }

  return (
    <section>
      <h1 className='mt-6 text-3xl font-bold text-center'>Sign Up</h1>
      <div className='flex flex-wrap items-center justify-center max-w-6xl px-6 py-12 mx-auto'>
        <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
          <img
            src='https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1373&q=80'
            alt='key'
            className='w-full rounded-2xl'
          />
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form onSubmit={onSubmit}>
            <input
              type='text'
              id='name'
              value={name}
              onChange={onChange}
              placeholder='Full name'
              className='w-full px-4 py-2 mb-6 text-xl text-gray-700 transition ease-in-out bg-white border-gray-300 rounded'
            />
            <input
              type='email'
              id='email'
              value={email}
              onChange={onChange}
              placeholder='Email address'
              className='w-full px-4 py-2 mb-6 text-xl text-gray-700 transition ease-in-out bg-white border-gray-300 rounded focus:outline-none focus:shadow-outline'
            />
            <div className='relative mb-6'>
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                value={password}
                onChange={onChange}
                placeholder='Password'
                className='w-full px-4 py-2 text-xl text-gray-700 transition ease-in-out bg-white border-gray-300 rounded focus:outline-none focus:shadow-outline'
              />
              {showPassword ? (
                <AiFillEyeInvisible
                  className='absolute text-xl cursor-pointer right-3 top-3'
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              ) : (
                <AiFillEye
                  className='absolute text-xl cursor-pointer right-3 top-3'
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              )}
            </div>
            <div className='flex justify-between text-sm whitespace-nowrap sm:text-lg'>
              <p className='mb-6'>
                Have a account?
                <Link
                  to='/login'
                  className='ml-1 text-red-600 transition duration-200 ease-in-out hover:text-red-700'
                >
                  Login
                </Link>
              </p>
              <p>
                <Link
                  to='/forgot-password'
                  className='text-blue-600 transition duration-200 ease-in-out hover:text-blue-800'
                >
                  Forgot password?
                </Link>
              </p>
            </div>
            <button
              className='w-full py-3 text-sm font-medium text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded shadow-md px-7 hover:bg-blue-700 hover:shadow-lg active:bg-blue-800'
              type='submit'
            >
              Sign Up
            </button>
            <div className='flex items-center my-4 before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300'>
              <p className='mx-4 font-semibold text-center'>OR</p>
            </div>
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;

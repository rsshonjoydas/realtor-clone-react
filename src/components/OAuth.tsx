import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { firestore } from '../config/firebase';

const OAuth = () => {
  const navigate = useNavigate();

  async function onGoogleClick() {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const { user } = result;

      // ? check for the user
      const docRef = doc(firestore, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }

      navigate('/');
    } catch (error) {
      toast.error('Could not authorize with Google');
    }
  }

  return (
    <button
      type='button'
      onClick={onGoogleClick}
      className='flex items-center justify-center w-full py-3 text-sm font-medium text-white uppercase transition duration-150 ease-in-out bg-red-600 rounded shadow-md px-7 hover:bg-red-700 active:bg-red-800 hover:shadow-lg active:shadow-lg'
    >
      <FcGoogle className='mr-2 text-2xl bg-red-300 rounded-full' />
      Continue with Google
    </button>
  );
};

export default OAuth;

import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';

export interface AuthStatus {
  loggedIn: boolean;
  checkingStatus: boolean;
}

export function useAuthStatus(): AuthStatus {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [checkingStatus, setCheckingStatus] = useState<boolean>(true);

  useEffect(() => {
    const auth = getAuth();
    console.log(auth);
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setLoggedIn(true);
      }
      setCheckingStatus(false);
    });
    return () => unsubscribe();
  }, []);

  return { loggedIn, checkingStatus };
}

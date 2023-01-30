import { getAuth, signOut } from 'firebase/auth';
import router from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';

const Signout = () => {
  const [firebaseUser, firebaseUserLoading, firebaseError] = useAuthState(getAuth());

  if (firebaseUser) {
    signOut(getAuth());
    router.reload();
  } else {
    router.push('/');
  }

  return <></>;
};

export default Signout;

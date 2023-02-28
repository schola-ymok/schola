import {
  EmailAuthProvider,
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth } from 'firebaseui';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import 'libs/firebase/firebase'; // Initialize FirebaseApp

export const FirebaseSignInForm = () => {
  const uiConfig: auth.Config = {
    signInFlow: 'popup',
    signInOptions: [
      EmailAuthProvider.PROVIDER_ID,
      FacebookAuthProvider.PROVIDER_ID,
      GoogleAuthProvider.PROVIDER_ID,
      // TwitterAuthProvider.PROVIDER_ID,
    ],
    signIndataUrl: '/',
  };

  return <StyledFirebaseAuth firebaseAuth={getAuth()} uiConfig={uiConfig} />;
};

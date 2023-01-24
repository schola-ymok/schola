import Box from '@mui/material/Box';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/router';
import { createContext, memo, useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { getMyBriefAccount } from 'api/getMyBriefAccount';
import CenterLoadingSpinner from 'components/CenterLoadingSpinner';
import { SignUpForm } from 'components/auth/SignUpForm';
import Header from 'components/headers/Header';
import { AppContext } from 'states/store';

const authAxios = axios.create();

export const AuthContext = createContext(
  {} as {
    authAxios: authAxios;
  },
);

//export const useAuth = () => useContext(AuthContext);

const Root = memo((props) => {
  const cstate = props.cstate;
  const router = useRouter();

  const forbiddens = ['/dashboard', '/account'];

  if (cstate == 'loading') {
    return CLoading();
  } else if (cstate == 'member') {
    return CMember();
  } else if (cstate == 'guest') {
    return CGuest();
  } else if (cstate == 'profile') {
    return CProfile();
  }

  function CLoading() {
    return (
      <>
        <Header authLoading />
        <Box sx={{ width: '100%', height: '100vh' }}>
          <CenterLoadingSpinner />
        </Box>
      </>
    );
  }

  function CProfile() {
    console.log('##profile');
    return (
      <AuthContext.Provider value={{ authAxios }}>
        <Box sx={{ display: 'flex' }}>
          <SignUpForm />
        </Box>
      </AuthContext.Provider>
    );
  }

  function CGuest() {
    console.log('##guest');

    const deny = forbiddens.some((elem) => {
      if (router.pathname.startsWith(elem)) return true;
    });

    if (deny) {
      router.push('/');
      return (
        <>
          <h3>forbidden</h3>
        </>
      );
    } else {
      return <>{props.children}</>;
    }
  }

  function CMember() {
    console.log('##meber');
    return <AuthContext.Provider value={{ authAxios }}>{props.children}</AuthContext.Provider>;
  }
});

export const AuthProvider = ({ children }) => {
  const [firebaseUser, firebaseUserLoading, firebaseError] = useAuthState(getAuth());
  const { state, dispatch } = useContext(AppContext);
  const [accountChecking, setAccountChecking] = useState(true);

  const reSetAxiosInterceptor = ({ interceptor, token, firebaseId, userId }) => {
    authAxios.interceptors.request.eject(interceptor);
    setAxiosInterceptor({
      token: token,
      firebaseId: firebaseId,
      userId: userId,
    });
  };

  const setAxiosInterceptor = ({ token, firebaseId, userId }) => {
    function sleep(time) {
      return new Promise(function (resolve, reject) {
        window.setTimeout(resolve, time);
      });
    }
    function makeDelayAxios(msMax, msMin = 0) {
      return async (config) => {
        await sleep(Math.random() * (msMax - msMin) + msMin);
        return config;
      };
    }

    // authAxios.interceptors.request.use(makeDelayAxios(1000, 500));

    return authAxios.interceptors.request.use(
      (config) => {
        config.headers = {
          Authorization: `Bearer ${token}`,
          firebase_id: `${firebaseId}`,
          user_id: `${userId}`,
        };
        return config;
      },
      (error) => {
        // tbd
        Promise.reject(error);
      },
    );
  };

  useEffect(() => {
    (async () => {
      if (firebaseUser) {
        setAccountChecking(true);

        var authAxiosParams;

        if (process.env.NEXT_PUBLIC_SKIP_AUTH == 'true') {
          authAxiosParams = {
            token: 'dummytoken',
            firebaseId: process.env.NEXT_PUBLIC_SKIP_AUTH_FID,
          };
        } else {
          const token = await firebaseUser.getIdToken();
          authAxiosParams = {
            token: token,
            firebaseId: firebaseUser.uid,
          };
        }

        const handleAxiosInterceper = setAxiosInterceptor(authAxiosParams);

        dispatch({
          type: 'PreLogin',
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          emailVerified: firebaseUser.emailVerified,
        });

        const { data } = await getMyBriefAccount(authAxios);
        // if error then signup form is displayed

        if (data) {
          reSetAxiosInterceptor({
            interceptor: handleAxiosInterceper,
            ...authAxiosParams,
            userId: data.userId,
          });

          //console.log(data);
          dispatch({
            type: 'Login',
            userId: data.userId,
            accountName: data.accountName,
            displayName: data.displayName,
            photoId: data.photoId,
          });
        }

        setAccountChecking(false);
      } else {
        if (state.isLoggedin) dispatch({ type: 'Logout' });
      }
    })();
  }, [firebaseUser]);

  var cstate;
  if (firebaseUserLoading || (accountChecking && firebaseUser)) {
    cstate = 'loading';
  } else if (firebaseUser) {
    if (state.isLoggedin) {
      cstate = 'member';
    } else {
      cstate = 'profile';
    }
  } else {
    cstate = 'guest';
  }

  return <Root cstate={cstate} children={children} />;
};

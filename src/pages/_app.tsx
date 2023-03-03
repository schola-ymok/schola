import { CacheProvider, EmotionCache } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { NextPage } from 'next';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import NextNprogress from 'nextjs-progressbar';
import PropTypes from 'prop-types';
import { ReactElement, ReactNode, useEffect } from 'react';

import { AuthProvider } from 'components/auth/AuthContext';
import createEmotionCache from 'components/mui/createEmotionCache';
import theme from 'components/mui/theme';

import 'libs/firebase/firebase';
import { StateProvider } from 'states/store';

import { GlobalStyles } from '@mui/material';

import Consts from 'utils/Consts';
import '../../styles/global.css';

type NextPageWithLayout = NextPage & {
  gtLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = MyAppProps & {
  Component: NextPageWithLayout;
};

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function updateBody() {
  const { pathname } = useRouter();
  useEffect(() => {
    let element = document.getElementById('schola');

    if (pathname == '/chapters/[chapter_id]/edit') {
      element.style.overflowY = 'hidden';
      element.style.top = '0';
    } else {
      element.style.top = 'unset';
      element.style.overflowY = 'scroll';
    }
  }, [pathname]);
}

function MyApp(props: AppPropsWithLayout) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  updateBody();

  return (
    <>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalStyles />
          <StateProvider>
            <NextNprogress
              color={Consts.COLOR.Primary}
              height={2}
              showOnShallow={true}
              options={{ showSpinner: false }}
            />
            <AuthProvider>{getLayout(<Component {...pageProps} />)}</AuthProvider>
          </StateProvider>
        </ThemeProvider>
      </CacheProvider>
    </>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;

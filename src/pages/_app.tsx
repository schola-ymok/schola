import { CacheProvider, EmotionCache } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { NextPage } from 'next';
import { AppProps } from 'next/app';
import NextNprogress from 'nextjs-progressbar';
import PropTypes from 'prop-types';
import { ReactElement, ReactNode } from 'react';

import { AuthProvider } from 'components/auth/AuthContext';
import createEmotionCache from 'components/mui/createEmotionCache';
import theme from 'components/mui/theme';

import 'libs/firebase/firebase';
import { StateProvider } from 'states/store';

import { GlobalStyles } from '@mui/material';

import '../../styles/global.css';
import Consts from 'utils/Consts';

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

function MyApp(props: AppPropsWithLayout) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        <StateProvider>
          <AuthProvider>
            <NextNprogress
              color={Consts.COLOR.Primary}
              height={2}
              showOnShallow={true}
              options={{ showSpinner: false }}
            />
            {getLayout(<Component {...pageProps} />)}
          </AuthProvider>
        </StateProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;

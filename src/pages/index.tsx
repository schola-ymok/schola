import {
  Card,
  Box,
  Button,
  Checkbox,
  Snackbar,
  CardContent,
  Link,
  Grid,
  Typography,
} from '@mui/material';
import error from 'next/error';
import router, { useRouter } from 'next/router';
import useSWR from 'swr';

import { getTextList } from 'api/getTextList';
import HomeTextList from 'components/HomeTextList';
import TextCard from 'components/TextCard';
import TextList from 'components/TextList';
import Layout from 'components/layouts/Layout';
import RootCategory from 'components/sidemenu/RootCategory';

import type { NextPage } from 'next';

const Home: NextPage = () => {
  const router = useRouter();
  const more = router.query.more !== undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <RootCategory />
      {!more ? <HomeTextList /> : <TextList />}
    </Box>
  );
};

Home.getLayout = (page) => <Layout>{page}</Layout>;
export default Home;

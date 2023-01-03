import { Card, Box, Pagination, Checkbox, Grid, Snackbar, CardContent, Link } from '@mui/material';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import { getAuth, sendEmailVerification } from 'firebase/auth';
import error from 'next/error';
import router, { useRouter } from 'next/router';
import { useState, useContext, useEffect } from 'react';
import * as React from 'react';
import useSWR from 'swr';

import { getPurchasedTextList } from 'api/getPurchasedTextList';
import { setNotifyOnPurchase } from 'api/setNotifyOnPurchase';
import { setNotifyOnReview } from 'api/setNotifyOnReview';
import { updateProfile } from 'api/updateProfile';
import TextCard from 'components/TextCard';
import TextListItem from 'components/TextListItem';
import { AuthContext } from 'components/auth/AuthContext';
import Layout from 'components/layouts/Layout';
import texts from 'pages/api/texts';
import { AppContext } from 'states/store';
import { pagenation } from 'utils/pagenation';

const PurchasedTexts = () => {
  const router = useRouter();

  const page = router.query.page ?? 1;
  const { authAxios } = useContext(AuthContext);

  const { data, error } = useSWR(
    `/account/texts?page=` + page,
    () => getPurchasedTextList(authAxios, page - 1),
    {
      revalidateOnFocus: false,
    },
  );

  if (error) return <h1>error</h1>;
  if (!data) return <h1>loading..</h1>;

  console.log(data);
  const { count, from, to } = pagenation(data.total, page, data.texts.length);

  return (
    <Box sx={{ display: 'flex', flexFlow: 'column', width: '100%', maxWidth: '700px' }}>
      <Box>
        <Box sx={{ fontSize: '1.2em', fontWeight: 'bold' }}>購入済テキスト一覧</Box>
        <Box>
          {data.total}件 （{from} - {to} を表示）
        </Box>
        {data.texts.map((item) => {
          return <TextListItem text={item} />;
        })}
      </Box>
      <Pagination
        sx={{ mt: 2 }}
        count={count}
        color='primary'
        onChange={(e, page) => router.replace(`/account/texts?page=${page}`)}
        page={+page}
      />
    </Box>
  );
};

PurchasedTexts.getLayout = (page) => <Layout>{page}</Layout>;
export default PurchasedTexts;

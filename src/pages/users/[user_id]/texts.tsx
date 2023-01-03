import {
  Card,
  Box,
  Pagination,
  Checkbox,
  Grid,
  Snackbar,
  CardContent,
  Link,
  useMediaQuery,
} from '@mui/material';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import { getAuth, sendEmailVerification } from 'firebase/auth';
import { list } from 'firebase/storage';
import error from 'next/error';
import router, { useRouter } from 'next/router';
import { useState, useContext, useEffect } from 'react';
import * as React from 'react';
import useSWR from 'swr';

import { getBriefUser } from 'api/getBriefUser';
import { getMyAccount } from 'api/getMyAccount';
import { getUser } from 'api/getUser';
import { getUserTexts } from 'api/getUserTexts';
import { setNotifyOnPurchase } from 'api/setNotifyOnPurchase';
import { setNotifyOnReview } from 'api/setNotifyOnReview';
import { updateProfile } from 'api/updateProfile';
import TextCard from 'components/TextCard';
import TextListItem from 'components/TextListItem';
import Layout from 'components/layouts/Layout';
import texts from 'pages/api/texts';
import { AppContext } from 'states/store';
import { pagenation } from 'utils/pagenation';

const UserTexts = () => {
  const router = useRouter();

  const page = router.query.page ?? 1;
  const mq = useMediaQuery('(min-width:600px)');

  const { data: briefUserData, error: briefUserError } = useSWR(
    `/users/${router.query.user_id}?brf=1`,
    () => getBriefUser(router.query.user_id),
    { revalidateOnFocus: false },
  );

  const { data: userTextsData, error: userTextsError } = useSWR(
    `/users/${router.query.user_id}/texts?page=${page}`,
    () => getUserTexts(router.query.user_id, page - 1),
    {
      revalidateOnFocus: false,
    },
  );

  if (briefUserError || userTextsError) {
    console.log(briefUserError);
    console.log(userTextsError);
  }

  if (!briefUserData || !userTextsData) return <h1>loading..</h1>;

  const { count, from, to } = pagenation(userTextsData.total, page, userTextsData.texts.length);

  return (
    <Box>
      <Box sx={{ fontSize: '1.7em', fontWeight: 'bold' }}>{briefUserData.displayName}</Box>
      <Box>
        公開テキスト一覧：{userTextsData.total}件 （{from} - {to} を表示）
        {mq ? (
          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap' }}>
            {userTextsData.texts.map((item) => {
              return <TextCard text={item} />;
            })}
          </Box>
        ) : (
          <Box sx={{ width: '100%', mb: 2, display: 'flex', flexFlow: 'column' }}>
            {userTextsData.texts.map((item) => {
              return <TextListItem text={item} />;
            })}
          </Box>
        )}
        <Pagination
          count={count}
          color='primary'
          onChange={(e, page) =>
            router.replace(`/users/${router.query.user_id}/texts?page=${page}`)
          }
          page={+page}
        />
      </Box>
    </Box>
  );
};

UserTexts.getLayout = (page) => <Layout>{page}</Layout>;
export default UserTexts;

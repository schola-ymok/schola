import { count } from 'console';
import { type } from 'os';
import { title } from 'process';

import {
  Card,
  Box,
  Pagination,
  Checkbox,
  Grid,
  Snackbar,
  CardContent,
  Typography,
  Stack,
  useMediaQuery,
} from '@mui/material';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import { getAuth, sendEmailVerification } from 'firebase/auth';
import { list } from 'firebase/storage';
import error from 'next/error';
import Link from 'next/link';
import router, { useRouter } from 'next/router';
import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import useSWR from 'swr';

import { getBriefUser } from 'api/getBriefUser';
import { getMyAccount } from 'api/getMyAccount';
import { getTextList } from 'api/getTextList';
import { getUser } from 'api/getUser';
import { getUserTexts } from 'api/getUserTexts';
import { setNotifyOnPurchase } from 'api/setNotifyOnPurchase';
import { setNotifyOnReview } from 'api/setNotifyOnReview';
import { updateProfile } from 'api/updateProfile';
import { AuthContext } from 'components/auth/AuthContext';
import Layout from 'components/layouts/Layout';
import texts from 'pages/api/texts';
import { AppContext } from 'states/store';
import { pagenation } from 'utils/pagenation';

import TextCard from './TextCard';
import TextListItem from './TextListItem';

const TextList = () => {
  const mq = useMediaQuery('(min-width:600px)');

  const page = router.query.page ?? 1;
  const type = router.query.type !== undefined ? router.query.type : 'latest';

  var category1 = '';
  var category2 = '';
  if (router.query.cat !== undefined) {
    category1 = router.query.cat[0];
    if (router.query.cat.length > 1) {
      category2 = router.query.cat[1];
    }
  }

  var thisPath = '';
  if (category1 !== '') thisPath += '/category/' + category1;
  if (category2 !== '') thisPath += '/' + category2;

  const params = { page: page, type: type, category1: category1, category2: category2 };

  var title;

  switch (type) {
    case 'ranking':
      title = '売れ筋のテキスト';
      break;
    case 'reviewed':
      title = '注目のテキスト';
      break;
    default:
      title = '最新のテキスト';
      break;
  }

  const { data, error } = useSWR(
    '/texts?' + new URLSearchParams(params).toString(),
    () => getTextList(params),
    {
      revalidateOnFocus: false,
    },
  );

  if (error) {
    console.log(error);
  }

  if (!data) return <h1>loading..</h1>;
  const { count, from, to } = pagenation(data.total, page, data.texts.length);

  return (
    <Box sx={{ display: 'flex', flexFlow: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        {mq ? <h5>{title}</h5> : <h6>{title}</h6>}
      </Box>

      <Box>
        {data.total}件のうち {from} - {to} 件
      </Box>

      {mq ? (
        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap' }}>
          {data.texts.map((item) => {
            return <TextCard text={item} />;
          })}
        </Box>
      ) : (
        <Box sx={{ width: '100%', mb: 2, display: 'flex', flexFlow: 'column' }}>
          {data.texts.map((item) => {
            return <TextListItem text={item} />;
          })}
        </Box>
      )}

      <Pagination
        count={count}
        color='primary'
        onChange={(e, page) => {
          delete params.category1;
          delete params.category2;
          router.push(
            thisPath + '?more&' + new URLSearchParams({ ...params, page: page }).toString(),
          );
        }}
        page={+page}
      />
    </Box>
  );
};

export default TextList;

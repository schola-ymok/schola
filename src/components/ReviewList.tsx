import { title } from 'process';

import {
  Card,
  Button,
  Checkbox,
  Snackbar,
  CardContent,
  Stack,
  Link,
  Divider,
  Grid,
  Rating,
  TextField,
  Typography,
  Pagination,
  Box,
} from '@mui/material';
import error from 'next/error';
import router, { useRouter } from 'next/router';
import { useState, useContext, useEffect, useLayoutEffect } from 'react';
import useSWR from 'swr';

import { getBriefText } from 'api/getBriefText';
import { getReviews } from 'api/getReviews';
import { upsertReview } from 'api/upsertReview';
import HomeTextList from 'components/HomeTextList';
import TextCard from 'components/TextCard';
import { AuthContext } from 'components/auth/AuthContext';
import Layout from 'components/layouts/Layout';
import RootCategory from 'components/sidemenu/RootCategory';
import Consts from 'utils/Consts';
import { pagenation } from 'utils/pagenation';

import Review from './ReviewItem';

import type { NextPage } from 'next';

const ReviewList: NextPage = ({ data, params }) => {
  const router = useRouter();
  const page = router.query.page ?? 1;

  const textId = router.query.text_id;

  const { count, from, to } = pagenation(data.total, page, data.reviews.length);

  const RateFilter = () => {
    if (router.query.rate !== undefined) {
      return (
        <>
          <Box component='span'>
            評価が <b>{router.query.rate}</b> のレビューを表示 (
          </Box>
          <Box
            component='span'
            sx={{
              color: Consts.COLOR.Primary,
              '&:hover': {
                textDecoration: 'underline',
                color: Consts.COLOR.PrimaryDark,
                cursor: 'pointer',
              },
            }}
            onClick={() => {
              router.push(`/texts/${textId}/reviews`);
            }}
          >
            フィルタを解除
          </Box>
          <Box component='span'>)</Box>
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Box sx={{ mb: 1 }}>
        <RateFilter />
        <Box sx={{ width: '100%' }}>
          {data.total}件のうち {from} - {to} 件
        </Box>
      </Box>
      <Box sx={{ width: { xs: '100%', sm: '80%', md: '70%' } }}>
        {data.reviews.map((item) => {
          return <Review key={item.id} review={item} />;
        })}
        <Pagination
          count={count}
          color='primary'
          onChange={(e, page) => {
            router.push(
              `/texts/${textId}/reviews?` +
                new URLSearchParams({ ...params, page: page }).toString(),
            );
          }}
          page={+page}
        />
      </Box>
    </Box>
  );
};

export default ReviewList;

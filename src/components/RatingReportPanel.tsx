import { text } from 'stream/consumers';

import StarIcon from '@mui/icons-material/Star';
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
  LinearProgress,
  linearProgressClasses,
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

import theme from './mui/theme';

import type { NextPage } from 'next';

const RatingReportPanel = ({ text }) => {
  const router = useRouter();
  const PercentageBar = ({ rate, value }) => (
    <Box sx={{ display: 'flex', mb: 0.5 }}>
      <LinearProgress
        variant='determinate'
        sx={{
          height: '12px',
          width: '110px',
          my: 'auto',
          [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: '#cccccc',
          },
          [`& .${linearProgressClasses.bar}`]: {
            backgroundColor: '#888888',
          },
        }}
        value={value}
      />
      <Rating
        name='size-small'
        defaultValue={rate}
        size='small'
        readOnly
        sx={{ mx: 1, my: 'auto' }}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize='inherit' />}
      />
      <Box
        sx={{
          fontSize: '0.8em',
          color: Consts.COLOR.Primary,
          '&:hover': {
            textDecoration: 'underline',
            color: Consts.COLOR.PrimaryDark,
            cursor: 'pointer',
          },
        }}
        onClick={() => {
          router.push(`/texts/${text.id}/reviews?rate=` + rate);
        }}
      >
        {value}%
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', width: 'fit-content' }}>
      <Box sx={{ width: '100px', display: 'flex' }}>
        <Box sx={{ m: 'auto' }}>
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ fontSize: '2.0em', fontWeight: 'bold', color: '#b46a10', m: 'auto' }}>
              {text.rate}
            </Box>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Rating
              name='size-small'
              defaultValue={text.rate}
              size='small'
              readOnly
              precision={0.5}
              sx={{ mx: 'auto' }}
              emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize='inherit' />}
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{ maxWidth: '230px', ml: 1 }}>
        <PercentageBar rate={5} value={text.rate_ratio_5} />
        <PercentageBar rate={4} value={text.rate_ratio_4} />
        <PercentageBar rate={3} value={text.rate_ratio_3} />
        <PercentageBar rate={2} value={text.rate_ratio_2} />
        <PercentageBar rate={1} value={text.rate_ratio_1} />
      </Box>
    </Box>
  );
};

export default RatingReportPanel;

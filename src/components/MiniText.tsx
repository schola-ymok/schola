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

const MiniText = ({ text }) => {
  const router = useRouter();

  const imageUrl = text.photo_id
    ? Consts.IMAGE_STORE_URL + text.photo_id + '.png'
    : '/cover-default.svg';

  const handleTextClick = () => {
    router.push(`/texts/${text.id}`);
  };

  const handleAuthorClick = () => {
    router.push(`/users/${text.author_id}`);
  };

  return (
    <Box sx={{ display: 'flex', mt: 1 }}>
      <Box
        component='img'
        display='flex'
        sx={{
          width: 100,
          height: 56,
          cursor: 'pointer',
        }}
        onClick={() => {}}
        src={imageUrl}
      />
      <Box sx={{ display: 'flex', flexFlow: 'column', py: 0.4, ml: 1 }}>
        <Box
          sx={{
            fontSize: '1.3em',
            fontWeight: 'bold',
            cursor: 'pointer',
            color: Consts.COLOR.Primary,
            '&:hover': {
              color: Consts.COLOR.PrimaryDark,
              textDecoration: 'underline',
            },
          }}
          onClick={handleTextClick}
        >
          {text.title}
        </Box>
        <Box
          sx={{
            fontSize: '1.0em',
            cursor: 'pointer',
            color: Consts.COLOR.Primary,
            '&:hover': {
              color: Consts.COLOR.PrimaryDark,
              textDecoration: 'underline',
            },
          }}
          onClick={handleAuthorClick}
        >
          {text.author_display_name}
        </Box>
      </Box>
    </Box>
  );
};

export default MiniText;

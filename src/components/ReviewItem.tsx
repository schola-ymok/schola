import { title } from 'process';

import {
  Card,
  Box,
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

import AvatarButton from './AvatarButton';
import ReadMoreText from './ReadMoreText';

const ReviewItem = ({ review, height = '100' }) => {
  const router = useRouter();

  const handleUserClick = () => {
    router.push(`/users/${review.user_id}`);
  };

  const handleReviewClick = () => {
    router.push(`/texts/${review.text_id}/reviews/${review.id}`);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex' }}>
        <AvatarButton photoId={review.user_photo_id} onClick={handleUserClick} size={35} />
        <Box
          sx={{
            my: 'auto',
            ml: 1,
            fontSize: '0.9em',
            cursor: 'pointer',
            '&:hover': {
              color: Consts.COLOR.Primary,
              textDecoration: 'underline',
            },
          }}
          onClick={handleUserClick}
        >
          {review.user_display_name}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', mt: 1 }}>
        <Rating readOnly value={review.rate} size='small' />
        <Box
          sx={{
            my: 'auto',
            ml: 1,
            fontWeight: 'bold',
            fontSize: '0.9em',
            cursor: 'pointer',
            '&:hover': {
              color: Consts.COLOR.Primary,
              textDecoration: 'underline',
            },
          }}
          onClick={handleReviewClick}
        >
          {review.title}
        </Box>
      </Box>
      <Box sx={{ fontSize: '0.9em', color: '#777777' }}>
        {new Date(review.updated_at).toLocaleDateString('ja')}
      </Box>
      <Box sx={{ mb: 2 }}>
        <ReadMoreText id={review.id} height={height} fontSize={'0.9em'}>
          {review.comment}
        </ReadMoreText>
      </Box>
    </Box>
  );
};

export default ReviewItem;

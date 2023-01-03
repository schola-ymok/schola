import {
  Card,
  Box,
  Button,
  Checkbox,
  Snackbar,
  CardContent,
  Stack,
  Link,
  Grid,
  Rating,
  TextField,
  Typography,
  Divider,
} from '@mui/material';
import error from 'next/error';
import router, { useRouter } from 'next/router';
import { useState, useContext, useEffect, useLayoutEffect } from 'react';
import useSWR from 'swr';

import { deleteReview } from 'api/deleteReview';
import { getBriefText } from 'api/getBriefText';
import { getPurchasedInfo } from 'api/getPurchasedInfo';
import { getReview } from 'api/getReview';
import { upsertReview } from 'api/upsertReview';
import HomeTextList from 'components/HomeTextList';
import MiniText from 'components/MiniText';
import RatingReportPanel from 'components/RatingReportPanel';
import ReviewItem from 'components/ReviewItem';
import ShowMore from 'components/ShowMore';
import TextCard from 'components/TextCard';
import { AuthContext } from 'components/auth/AuthContext';
import Layout from 'components/layouts/Layout';
import RootCategory from 'components/sidemenu/RootCategory';
import { AppContext } from 'states/store';
import { pagenation } from 'utils/pagenation';

import type { NextPage } from 'next';

const Review: NextPage = () => {
  const router = useRouter();

  const textId = router.query.text_id;
  const reviewId = router.query.review_id;
  const { authAxios } = useContext(AuthContext);
  const { state, dispatch } = useContext(AppContext);

  const { data: dataText, error: errorText } = useSWR(
    `texts/${textId}?brf=1`,
    () => getBriefText(textId),
    {
      revalidateOnFocus: false,
    },
  );
  const { data: dataReview, error: errorReview } = useSWR(
    `texts/${textId}/reviews/${reviewId}`,
    () => getReview(textId, reviewId),
    {
      revalidateOnFocus: false,
    },
  );

  const handleWriteReviewClick = () => {
    router.push(`/texts/${textId}/reviews/edit`);
  };

  const handleAllReviewListClick = () => {
    router.push(`/texts/${textId}/reviews`);
  };

  async function handleDeleteReviewClick() {
    const { data, error } = await deleteReview(textId, authAxios);

    if (error) {
      console.log(error);
      return;
    }

    router.replace(`/texts/${textId}/reviews`);
  }

  if (errorText) console.log(errorText);
  if (!dataText) return <h1>loading..</h1>;
  if (errorReview) console.log(errorReview);
  if (!dataReview) return <h1>loading..</h1>;

  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        <Box
          sx={{
            display: 'flex',
            flexFlow: 'column',
            width: { sm: '100%', md: 'calc(100% - 400px)' },
          }}
        >
          <Box sx={{ fontWeight: 'bold', fontSize: '1.4em' }}>読者からのレビュー</Box>
          <Box sx={{ mr: { md: 10, sm: 0 }, mt: 1 }}>
            <ReviewItem review={dataReview} height='300' />
          </Box>
          {state.userId === dataReview.user_id && (
            <Box sx={{ display: 'flx', mb: 2 }}>
              <Button
                sx={{ fontWeight: 'bold', width: '200px', mr: 1 }}
                variant='contained'
                size='small'
                onClick={handleWriteReviewClick}
              >
                レビューを編集
              </Button>
              <Button
                sx={{ fontWeight: 'bold', width: '200px' }}
                variant='contained'
                size='small'
                onClick={handleDeleteReviewClick}
              >
                レビューを削除
              </Button>
            </Box>
          )}
        </Box>

        <Box sx={{ width: '400px' }}>
          <Stack>
            <MiniText text={dataText} />
            {state.userId !== dataReview.user_id && (
              <Button
                variant='contained'
                sx={{ fontWeight: 'bold', fontSize: '0.9em', width: '150px', mb: 1 }}
                size='small'
                onClick={handleWriteReviewClick}
              >
                レビューを書く
              </Button>
            )}
            <RatingReportPanel text={dataText} />
            <ShowMore onClick={handleAllReviewListClick}>全てのレビューを参照</ShowMore>
          </Stack>
        </Box>
      </Box>
    </>
  );
};

Review.getLayout = (page) => <Layout>{page}</Layout>;
export default Review;

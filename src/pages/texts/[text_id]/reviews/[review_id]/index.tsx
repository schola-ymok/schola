import { Box, Button, Snackbar, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import useSWR from 'swr';

import { deleteReview } from 'api/deleteReview';
import { getBriefText } from 'api/getBriefText';
import { getReview } from 'api/getReview';
import { getReviews } from 'api/getReviews';
import CenterLoadingSpinner from 'components/CenterLoadingSpinner';
import DefaultButton from 'components/DefaultButton';
import LoadingBackDrop from 'components/LoadingBackDrop';
import MiniText from 'components/MiniText';
import RatingReportPanel from 'components/RatingReportPanel';
import ReviewItem from 'components/ReviewItem';
import ShowMore from 'components/ShowMore';
import { AuthContext } from 'components/auth/AuthContext';
import Layout from 'components/layouts/Layout';
import { AppContext } from 'states/store';
import { genid } from 'utils/genid';

import type { NextPage } from 'next';

const Review: NextPage = () => {
  const router = useRouter();

  const textId = router.query.text_id;
  const reviewId = router.query.review_id;
  const { authAxios } = useContext(AuthContext);
  const { state } = useContext(AppContext);
  const [swrKey] = useState(genid(4));
  const [isLoading, setLoading] = useState(false);

  const [notice, setNotice] = useState({ open: false, message: '' });

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

  const { data: dataReviews, error: errorReviews } = useSWR(
    `texts/${textId}/reviews/_${swrKey}`,
    () => getReviews(textId, null, authAxios),
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
    setLoading(true);

    const { data, error } = await deleteReview(textId, authAxios);

    if (error) {
      console.log(error);
      return;
    }

    setNotice({ open: true, message: 'レビューを削除しました' });

    setTimeout(() => {
      router.push(`/texts/${textId}/reviews`);
    }, 1000);
  }

  if (errorText) console.log(errorText);
  if (errorReview) console.log(errorReview);
  if (!dataText || !dataReview || !dataReviews) return <CenterLoadingSpinner />;

  return (
    <>
      {isLoading && <LoadingBackDrop />}
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
            <Box sx={{ display: 'flex', mb: 2 }}>
              <DefaultButton
                sx={{ fontWeight: 'bold', width: '20%', minWidth: '150px' }}
                onClick={handleDeleteReviewClick}
              >
                レビューを削除
              </DefaultButton>
              <DefaultButton
                sx={{ width: '20%', fontWeight: 'bold', minWidth: '150px', ml: 1 }}
                onClick={handleWriteReviewClick}
              >
                レビューを編集
              </DefaultButton>
            </Box>
          )}
        </Box>

        <Box sx={{ width: '400px' }}>
          <Stack>
            <MiniText text={dataText} />
            {state.userId !== dataReview.user_id && state.userId != dataText.author_id && (
              <DefaultButton sx={{ width: '180px', mb: 1 }} onClick={handleWriteReviewClick}>
                レビューを{dataReviews.is_mine_exists ? '編集する' : '書く'}
              </DefaultButton>
            )}
            <RatingReportPanel text={dataText} />
            <ShowMore onClick={handleAllReviewListClick}>
              全てのレビューを参照（{dataReviews.total}）
            </ShowMore>
          </Stack>
        </Box>
        <Snackbar
          open={notice.open}
          message={notice.message}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Box>
    </>
  );
};

Review.getLayout = (page) => <Layout>{page}</Layout>;
export default Review;

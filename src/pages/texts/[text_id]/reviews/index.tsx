import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import useSWR from 'swr';

import { getBriefText } from 'api/getBriefText';
import { getReviews } from 'api/getReviews';
import CenterLoadingSpinner from 'components/CenterLoadingSpinner';
import DefaultButton from 'components/DefaultButton';
import MiniText from 'components/MiniText';
import RatingReportPanel from 'components/RatingReportPanel';
import ReviewList from 'components/ReviewList';
import { AuthContext } from 'components/auth/AuthContext';
import Layout from 'components/layouts/Layout';
import { AppContext } from 'states/store';
import Consts from 'utils/Consts';
import { genid } from 'utils/genid';

import type { NextPage } from 'next';

const Review: NextPage = () => {
  const router = useRouter();
  const page = router.query.page ?? 1;

  const textId = router.query.text_id;

  let params = { page: page };
  if (router.query.rate !== undefined) params.rate = router.query.rate;

  const { state } = useContext(AppContext);
  const { authAxios } = useContext(AuthContext);
  const [swrKey] = useState(genid(4));

  const { data: dataText, error: errorText } = useSWR(
    `texts/${textId}?brf=1`,
    () => getBriefText(textId),
    {
      revalidateOnFocus: false,
    },
  );

  const { data: dataReviews, error: errorReviews } = useSWR(
    `texts/${textId}/reviews?` + new URLSearchParams(params).toString() + '_' + swrKey,
    () => getReviews(textId, params, authAxios),
    {
      revalidateOnFocus: false,
    },
  );

  if (errorText) console.log(errorText);
  if (errorReviews) console.log(errorReviews);

  if (!dataText || !dataReviews) return <CenterLoadingSpinner />;

  const myText = state.userId == dataText.author_id;

  const handleWriteReviewClick = () => {
    router.push(`/texts/${textId}/reviews/edit`);
  };

  const imageUrl = dataText.photo_id
    ? Consts.IMAGE_STORE_URL + dataText.photo_id + '.png'
    : '/cover-default.svg';

  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        <Box sx={{ width: { xs: '100%', sm: 'fit-content' } }}>
          <Box sx={{ fontWeight: 'bold', fontSize: '1.4em' }}>読者からのレビュー</Box>
          <RatingReportPanel text={dataText} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexFlow: 'column',
            ml: { xs: 0, sm: 4 },
            width: { xs: '100%', sm: 'fit-content' },
          }}
        >
          <MiniText text={dataText} />

          {!myText && (
            <DefaultButton
              sx={{ fontWeight: 'bold', fontSize: '0.9em', width: '180px', mt: 0.5 }}
              onClick={handleWriteReviewClick}
            >
              レビューを{dataReviews.is_mine_exists ? '編集する' : '書く'}
            </DefaultButton>
          )}
        </Box>
      </Box>

      <Box>
        <ReviewList data={dataReviews} params={params} />
      </Box>
    </>
  );
};

Review.getLayout = (page) => <Layout>{page}</Layout>;
export default Review;

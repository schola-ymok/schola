import { Box, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import useSWR from 'swr';

import { getBriefText } from 'api/getBriefText';
import { getReviews } from 'api/getReviews';
import MiniText from 'components/MiniText';
import RatingReportPanel from 'components/RatingReportPanel';
import ReviewList from 'components/ReviewList';
import { AuthContext } from 'components/auth/AuthContext';
import Layout from 'components/layouts/Layout';
import Consts from 'utils/Consts';

import type { NextPage } from 'next';

const Review: NextPage = () => {
  const router = useRouter();
  const page = router.query.page ?? 1;

  const textId = router.query.text_id;

  let params = { page: page };
  if (router.query.rate !== undefined) params.rate = router.query.rate;

  const { authAxios } = useContext(AuthContext);

  const { data: dataText, error: errorText } = useSWR(
    `texts/${textId}?brf=1`,
    () => getBriefText(textId),
    {
      revalidateOnFocus: false,
    },
  );

  const { data: dataReviews, error: errorReviews } = useSWR(
    `texts/${textId}/reviews?` + new URLSearchParams(params).toString(),
    () => getReviews(textId, params),
    {
      revalidateOnFocus: false,
    },
  );

  /*
  const ref = useRef(true);

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      return;
    }

    const query = new URLSearchParams({ ...rateFilter }).toString();

    router.push(`/texts/${router.query.text_id}/reviews?` + query, undefined, {
      scroll: false,
    });
  }, [rateFilter]);
  */

  if (errorText) console.log(errorText);
  if (errorReviews) console.log(errorReviews);

  if (!dataText || !dataReviews) return <h1>loading..</h1>;

  const handleWriteReviewClick = () => {
    router.push(`/texts/${textId}/reviews/edit`);
  };

  const handleTextClick = () => {
    router.push(`/texts/${textId}`);
  };

  const handleAuthorClick = () => {
    router.push(`/users/${dataText.author_id}`);
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

          <Button
            variant='contained'
            sx={{ fontWeight: 'bold', fontSize: '0.9em', width: '150px' }}
            size='small'
            onClick={handleWriteReviewClick}
          >
            レビューを書く
          </Button>
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

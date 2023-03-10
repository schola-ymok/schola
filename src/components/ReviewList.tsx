import { Box, Pagination } from '@mui/material';
import { useRouter } from 'next/router';

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
        {count > 1 && (
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
        )}
      </Box>
    </Box>
  );
};

export default ReviewList;

import { Box, Pagination } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import useSWR from 'swr';

import { getReviewListForMyText } from 'api/getReviewListForMyText';
import CenterLoadingSpinner from 'components/CenterLoadingSpinner';
import Review from 'components/ReviewItem';
import { AuthContext } from 'components/auth/AuthContext';
import Layout from 'components/layouts/Layout';
import DashboardMenuLeft from 'components/sidemenu/DashboardMenuLeft';
import { pagenation } from 'utils/pagenation';

const DashboardReviews = () => {
  const router = useRouter();

  const page = router.query.page ?? 1;
  const { authAxios } = useContext(AuthContext);

  const { data, error } = useSWR(
    `/dashboard/reviews?page=${page}`,
    () => getReviewListForMyText(authAxios, page - 1),
    {
      revalidateOnFocus: false,
    },
  );

  if (error) return <h1>error</h1>;

  const DataContent = ({ data }) => {
    if (!data) return <CenterLoadingSpinner />;

    if (data.total == 0) return <Box>レビューはありません</Box>;

    const { count, from, to } = pagenation(data.total, page, data.reviews.length);
    return (
      <>
        <Box>
          {data.total}件 （{from} - {to} を表示）
        </Box>
        {data.reviews.map((item) => {
          return <Review key={item.id} review={item} />;
        })}
        {count > 1 && (
          <Pagination
            sx={{ mt: 2 }}
            count={count}
            color='primary'
            onChange={(e, page) => router.replace(`/dashboard/reviews?page=${page}`)}
            page={+page}
          />
        )}
      </>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexFlow: 'column', width: '100%', maxWidth: '700px' }}>
      <Box>
        <Box sx={{ fontSize: '1.2em', fontWeight: 'bold', mb: 1 }}>レビュー一覧</Box>
        <DataContent data={data} />
      </Box>
    </Box>
  );
};

export default DashboardReviews;

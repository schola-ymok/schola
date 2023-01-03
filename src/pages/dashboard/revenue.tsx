import {
    Box, Divider, Grid, Link, Pagination, Rating
} from '@mui/material';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import useSWR from 'swr';

import { getReviewListForMyText } from 'api/getReviewListForMyText';
import { AuthContext } from 'components/auth/AuthContext';
import Layout from 'components/layouts/Layout';
import DashboardMenu from 'components/sidemenu/DashboardMenuLeft';
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
  if (!data) return <h1>loading..</h1>;

  console.log(data);

  const { count, from, to } = pagenation(data.total, page, data.reviews.length);

  return (
    <Grid container>
      <Grid item xs={2}>
        <DashboardMenu />
      </Grid>
      <Grid item xs={10}>
        <h2>
          レビュー一覧：{data.total}件 （{from} - {to} を表示）
        </h2>
        <Stack>
          {data.reviews.map((item) => {
            return (
              <Box key={item.id}>
                <Link href={`/texts/${item.text_id}/reviews/${item.id}/`}>
                  <h4>
                    <Rating value={item.rate} size='small' />
                    {item.title}
                  </h4>
                  <Box>{item.comment}</Box>
                  <span>{item.user_display_name}</span>
                </Link>
                <Divider />
              </Box>
            );
          })}
        </Stack>
        <Box>
          <Pagination
            count={count}
            color='primary'
            onChange={(e, page) => router.replace(`/dashboard/reviews?page=${page}`)}
            page={+page}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

DashboardReviews.getLayout = (page) => <Layout>{page}</Layout>;
export default DashboardReviews;

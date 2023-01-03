import { Box, Divider, Grid, Link, Pagination, Rating } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import useSWR from 'swr';

import { getReviewListForMyText } from 'api/getReviewListForMyText';
import { AuthContext } from 'components/auth/AuthContext';
import Layout from 'components/layouts/Layout';
import DashboardMenu from 'components/sidemenu/DashboardMenuLeft';
import DashboardMenuLeft from 'components/sidemenu/DashboardMenuLeft';
import { pagenation } from 'utils/pagenation';

const DashboardReviews = () => {
  const router = useRouter();

  const page = router.query.page ?? 1;
  const { authAxios } = useContext(AuthContext);

  return (
    <Box sx={{ display: 'flex' }}>
      <DashboardMenuLeft />
      <Box sx={{ display: 'flex', flexFlow: 'column', width: '100%', maxWidth: '700px' }}>
        <Box>
          <Box sx={{ fontSize: '1.2em', fontWeight: 'bold', mb: 1 }}>未実装：登録口座への送金</Box>
        </Box>
      </Box>
    </Box>
  );
};

DashboardReviews.getLayout = (page) => <Layout>{page}</Layout>;
export default DashboardReviews;

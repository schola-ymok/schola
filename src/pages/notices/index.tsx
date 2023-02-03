import { Box, Container, Divider, Pagination } from '@mui/material';
import htmlParse from 'html-react-parser';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import useSWR from 'swr';

import { getBriefText } from 'api/getBriefText';
import { getNotifications } from 'api/getNotifications';
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
import { pagenation } from 'utils/pagenation';

import type { NextPage } from 'next';

const Notices: NextPage = () => {
  const router = useRouter();
  const page = router.query.page ?? 1;

  let params = { page: page };

  const { authAxios } = useContext(AuthContext);
  const [swrKey] = useState(genid(4));

  const { data, error } = useSWR(
    `notices?page=` + page + '_' + swrKey,
    () => getNotifications(authAxios, page),
    {
      revalidateOnFocus: false,
    },
  );

  if (error) console.log(error);
  if (!data) return <CenterLoadingSpinner />;

  const { count, from, to } = pagenation(data.total, page, data.notices.length);

  const NoticeItem = ({ children, onClick }) => (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        flexFlow: 'column',
        px: 1,
        py: 1.2,
        alignItems: 'center',
        '&:hover': {
          backgroundColor: '#efefef',
          cursor: 'pointer',
        },
      }}
    >
      {children}
    </Box>
  );
  return (
    <>
      <Container maxWidth='sm'>
        <Box sx={{ fontWeight: 'bold', fontSize: '1.4em' }}>通知一覧</Box>
        <Box sx={{ width: '100%' }}>
          {data.total}件のうち {from} - {to} 件
        </Box>

        <Box sx={{ py: 2 }}>
          {data.notices.map((item, index) => {
            const html = htmlParse(item.message);
            const date = new Date(item.created_at).toLocaleString('ja');
            return (
              <>
                {index > 0 && <Divider />}
                <NoticeItem
                  onClick={() => {
                    router.push(item.url);
                  }}
                >
                  <Box sx={{ fontSize: '0.9em', mr: 'auto' }}>{html}</Box>
                  <Box sx={{ mr: 'auto', fontSize: '0.7em', color: '#999999' }}>{date}</Box>
                </NoticeItem>
              </>
            );
          })}
        </Box>

        {count > 1 && (
          <Pagination
            count={count}
            color='primary'
            onChange={(e, page) => {
              router.push(`/notices?` + new URLSearchParams({ ...params, page: page }).toString());
            }}
            page={+page}
          />
        )}
      </Container>
    </>
  );
};

Notices.getLayout = (page) => <Layout>{page}</Layout>;
export default Notices;

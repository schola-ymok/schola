import { Box, Pagination, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import { getBriefUser } from 'api/getBriefUser';
import { getUserTexts } from 'api/getUserTexts';
import CenterLoadingSpinner from 'components/CenterLoadingSpinner';
import TextCard from 'components/TextCard';
import TextListItem from 'components/TextListItem';
import Layout from 'components/layouts/Layout';
import Consts from 'utils/Consts';
import { pagenation } from 'utils/pagenation';

const UserTexts = () => {
  const router = useRouter();

  const page = router.query.page ?? 1;
  const mq = useMediaQuery('(min-width:600px)');
  const userId = router.query.user_id;

  const { data: briefUserData, error: briefUserError } = useSWR(
    `/users/${userId}?brf=1`,
    () => getBriefUser(userId),
    { revalidateOnFocus: false },
  );

  const { data: userTextsData, error: userTextsError } = useSWR(
    `/users/${userId}/texts?page=${page}`,
    () => getUserTexts(userId, page - 1),
    {
      revalidateOnFocus: false,
    },
  );

  if (briefUserError || userTextsError) {
    console.log(briefUserError);
    console.log(userTextsError);
  }

  if (!briefUserData) return <CenterLoadingSpinner />;

  const DataContent = ({ data }) => {
    if (!data) return <CenterLoadingSpinner />;
    const { count, from, to } = pagenation(data.total, page, data.texts.length);

    return (
      <Box>
        {data.total}件 （{from} - {to} を表示）
        {mq ? (
          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap' }}>
            {data.texts.map((item) => {
              return <TextCard text={item} />;
            })}
          </Box>
        ) : (
          <Box sx={{ width: '100%', mb: 2, display: 'flex', flexFlow: 'column' }}>
            {data.texts.map((item) => {
              return <TextListItem text={item} />;
            })}
          </Box>
        )}
        <Pagination
          count={count}
          color='primary'
          onChange={(e, page) => router.replace(`/users/${userId}/texts?page=${page}`)}
          page={+page}
        />
      </Box>
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', mb: 1 }}>
        <Box
          sx={{
            fontSize: '1.7em',
            fontWeight: 'bold',
            cursor: 'pointer',
            '&:hover': {
              color: Consts.COLOR.Primary,
              textDecoration: 'underline',
            },
          }}
          onClick={() => {
            router.push(`/users/${userId}`);
          }}
        >
          {briefUserData.displayName}
        </Box>
        <Box sx={{ fontSize: '1.2em', mt: 1, ml: 0.5 }}>が執筆したテキスト一覧</Box>
      </Box>
      <DataContent data={userTextsData} />
    </Box>
  );
};

UserTexts.getLayout = (page) => <Layout>{page}</Layout>;
export default UserTexts;

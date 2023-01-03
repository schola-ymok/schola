import {
    Box,
    Pagination, useMediaQuery
} from '@mui/material';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import { getBriefUser } from 'api/getBriefUser';
import { getUserTexts } from 'api/getUserTexts';
import Layout from 'components/layouts/Layout';
import TextCard from 'components/TextCard';
import TextListItem from 'components/TextListItem';
import { pagenation } from 'utils/pagenation';

const UserTexts = () => {
  const router = useRouter();

  const page = router.query.page ?? 1;
  const mq = useMediaQuery('(min-width:600px)');

  const { data: briefUserData, error: briefUserError } = useSWR(
    `/users/${router.query.user_id}?brf=1`,
    () => getBriefUser(router.query.user_id),
    { revalidateOnFocus: false },
  );

  const { data: userTextsData, error: userTextsError } = useSWR(
    `/users/${router.query.user_id}/texts?page=${page}`,
    () => getUserTexts(router.query.user_id, page - 1),
    {
      revalidateOnFocus: false,
    },
  );

  if (briefUserError || userTextsError) {
    console.log(briefUserError);
    console.log(userTextsError);
  }

  if (!briefUserData || !userTextsData) return <h1>loading..</h1>;

  const { count, from, to } = pagenation(userTextsData.total, page, userTextsData.texts.length);

  return (
    <Box>
      <Box sx={{ fontSize: '1.7em', fontWeight: 'bold' }}>{briefUserData.displayName}</Box>
      <Box>
        公開テキスト一覧：{userTextsData.total}件 （{from} - {to} を表示）
        {mq ? (
          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap' }}>
            {userTextsData.texts.map((item) => {
              return <TextCard text={item} />;
            })}
          </Box>
        ) : (
          <Box sx={{ width: '100%', mb: 2, display: 'flex', flexFlow: 'column' }}>
            {userTextsData.texts.map((item) => {
              return <TextListItem text={item} />;
            })}
          </Box>
        )}
        <Pagination
          count={count}
          color='primary'
          onChange={(e, page) =>
            router.replace(`/users/${router.query.user_id}/texts?page=${page}`)
          }
          page={+page}
        />
      </Box>
    </Box>
  );
};

UserTexts.getLayout = (page) => <Layout>{page}</Layout>;
export default UserTexts;

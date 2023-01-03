import {
    Box,
    Pagination
} from '@mui/material';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import { deleteText } from 'api/deleteText';
import { getMyTextList } from 'api/getMyTextList';
import { AuthContext } from 'components/auth/AuthContext';
import DashboardTextListItem from 'components/DashboardTextListItem';
import Layout from 'components/layouts/Layout';
import DashboardMenuLeft from 'components/sidemenu/DashboardMenuLeft';
import { pagenation } from 'utils/pagenation';

const DashboardTexts = () => {
  const router = useRouter();

  const page = router.query.page ?? 1;
  const { authAxios } = useContext(AuthContext);

  const { mutate } = useSWRConfig();
  const { data, error } = useSWR(
    `/dashboard/texts?page=${page}`,
    () => getMyTextList(authAxios, page - 1),
    {
      revalidateOnFocus: false,
    },
  );

  if (error) return <h1>error</h1>;
  if (!data) return <h1>loading..</h1>;

  const { count, from, to } = pagenation(data.total, page, data.texts.length);

  async function handleDeleteText(textId) {
    const { error } = await deleteText(textId, authAxios);
    if (error) {
      console.log(error);
      return;
    }

    mutate(`/dashboard/texts?page=${page}`);
  }

  const handleEditText = (textId) => {
    router.push(`/texts/${textId}/edit`);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <DashboardMenuLeft />

      <Box sx={{ display: 'flex', flexFlow: 'column', width: '100%', maxWidth: '700px' }}>
        <Box>
          <Box sx={{ fontSize: '1.2em', fontWeight: 'bold' }}>執筆テキスト一覧</Box>
          <Box>
            {data.total}件 （{from} - {to} を表示）
          </Box>
          {data.texts.map((item) => {
            return (
              <DashboardTextListItem
                text={item}
                handleDeleteText={handleDeleteText}
                handleEditText={handleEditText}
              />
            );
          })}
        </Box>
        <Pagination
          sx={{ mt: 2 }}
          count={count}
          color='primary'
          onChange={(e, page) => router.replace(`/dashboard/?page=${page}`)}
          page={+page}
        />
      </Box>
    </Box>
  );
};

DashboardTexts.getLayout = (page) => <Layout>{page}</Layout>;
export default DashboardTexts;

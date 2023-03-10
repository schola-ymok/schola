import { Box, Divider, Pagination } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import { deleteText } from 'api/deleteText';
import { getMyTextList } from 'api/getMyTextList';
import CenterLoadingSpinner from 'components/CenterLoadingSpinner';
import LoadingBackDrop from 'components/LoadingBackDrop';
import { AuthContext } from 'components/auth/AuthContext';
import DashboardTextListItem from 'components/dashboard/DashboardTextListItem';
import { pagenation } from 'utils/pagenation';

const DashboardTextList = () => {
  const router = useRouter();

  const page = router.query.page ?? 1;
  const { authAxios } = useContext(AuthContext);

  const [isDeleting, setIsDeleting] = useState(false);

  const { mutate } = useSWRConfig();
  const { data, error } = useSWR(
    `/dashboard/texts?page=${page}`,
    () => getMyTextList(authAxios, page - 1),
    {
      revalidateOnFocus: false,
    },
  );

  useEffect(() => {
    setIsDeleting(false);
  }, [data]);

  if (error) return <h1>error</h1>;

  async function handleDeleteText(textId) {
    setIsDeleting(true);
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

  const DataContent = ({ data }) => {
    if (!data) return <CenterLoadingSpinner />;

    if (data.total == 0) {
      return <Box>執筆テキストはありません</Box>;
    }

    const { count, from, to } = pagenation(data.total, page, data.texts.length);

    if (from > data.total) router.push(`/dashboard/`);

    return (
      <>
        {isDeleting && <LoadingBackDrop />}
        <Box>
          {data.total}件 （{from} - {to} を表示）
        </Box>
        {data.texts.map((item, index) => {
          return (
            <Box key={item.id}>
              {index > 0 && <Divider key={item.id + '_d'} />}
              <DashboardTextListItem
                text={item}
                handleDeleteText={() => handleDeleteText(item.id)}
                handleEditText={() => handleEditText(item.id)}
              />
            </Box>
          );
        })}
        {count > 1 && (
          <Pagination
            sx={{ mt: 2 }}
            count={count}
            color='primary'
            onChange={(e, page) => router.push(`/dashboard/?page=${page}`)}
            page={+page}
          />
        )}
      </>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexFlow: 'column', width: '100%' }}>
      <Box>
        <Box sx={{ fontSize: '1.2em', fontWeight: 'bold', mb: 1 }}>執筆テキスト一覧</Box>
        <DataContent data={data} />
      </Box>
    </Box>
  );
};

export default DashboardTextList;

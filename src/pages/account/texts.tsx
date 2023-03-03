import { Box, Pagination } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import useSWR from 'swr';

import { getPurchasedTextList } from 'api/getPurchasedTextList';
import CenterLoadingSpinner from 'components/CenterLoadingSpinner';
import TextListItem from 'components/TextListItem';
import Title from 'components/Title';
import { AuthContext } from 'components/auth/AuthContext';
import Layout from 'components/layouts/Layout';
import { pagenation } from 'utils/pagenation';

const PurchasedTexts = () => {
  const router = useRouter();

  const page = router.query.page ?? 1;
  const { authAxios } = useContext(AuthContext);

  const { data, error } = useSWR(
    `/account/texts?page=` + page,
    () => getPurchasedTextList(authAxios, page - 1),
    {
      revalidateOnFocus: false,
    },
  );

  if (error) return <h1>error</h1>;

  const DataContent = ({ data }) => {
    if (!data) return <CenterLoadingSpinner />;

    if (data.total == 0) return <Box sx={{ p: 1 }}>購入したテキストはありません</Box>;

    const { count, from, to } = pagenation(data.total, page, data.texts.length);
    return (
      <>
        <Box>
          {data.total}件 （{from} - {to} を表示）
        </Box>
        {data.texts.map((item) => {
          return <TextListItem key={item.id} text={item} />;
        })}
        {count > 1 && (
          <Pagination
            sx={{ mt: 2 }}
            count={count}
            color='primary'
            onChange={(e, page) => router.push(`/account/texts?page=${page}`)}
            page={+page}
          />
        )}
      </>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexFlow: 'column', width: '100%', maxWidth: '700px' }}>
      <Title title={'Schola | 購入済テキスト'} />
      <Box>
        <Box sx={{ fontSize: '1.2em', fontWeight: 'bold' }}>購入済テキスト一覧</Box>
        <DataContent data={data} />
      </Box>
    </Box>
  );
};

PurchasedTexts.getLayout = (page) => <Layout>{page}</Layout>;
export default PurchasedTexts;

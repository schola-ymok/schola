import { Box, Pagination, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import { getTextList } from 'api/getTextList';
import { pagenation } from 'utils/pagenation';

import CenterLoadingSpinner from './CenterLoadingSpinner';
import TextCard from './TextCard';
import TextListItem from './TextListItem';

const SearchTextList = () => {
  const router = useRouter();
  const page = router.query.page ?? 1;
  const mq = useMediaQuery('(min-width:600px)');

  let params = { page: page };

  if (router.query.sort !== undefined) params.sort = router.query.sort;
  if (router.query.rate !== undefined) params.rate = router.query.rate;
  if (router.query.keyword !== undefined) params.keyword = router.query.keyword;
  if (router.query.pf_1 !== undefined) params.pf_1 = 1;
  if (router.query.pf_2 !== undefined) params.pf_2 = 1;
  if (router.query.pf_3 !== undefined) params.pf_3 = 1;
  if (router.query.pf_4 !== undefined) params.pf_4 = 1;
  if (router.query.pf_5 !== undefined) params.pf_5 = 1;

  const { data, error } = useSWR(
    '/texts?' + new URLSearchParams(params).toString(),
    () => getTextList(params),
    {
      revalidateOnFocus: false,
    },
  );

  if (error) console.log(error);
  if (!data) return <CenterLoadingSpinner />;
  const { count, from, to } = pagenation(data.total, page, data.texts.length);

  return (
    <>
      {router.query.rate > 0 && <Box>評価が{router.query.rate}以上</Box>}
      {(router.query.pf_1 || router.query.pf_2 || router.query.pf_3 || router.query.pf_4) && (
        <Box>
          価格帯：
          {router.query.pf_1 && <>100-200円&nbsp;</>}
          {router.query.pf_2 && <>200-300円&nbsp;</>}
          {router.query.pf_3 && <>300-400円&nbsp;</>}
          {router.query.pf_4 && <>400-500円&nbsp;</>}
          {router.query.pf_5 && <>500-1,000円</>}
        </Box>
      )}
      <Box>
        {data.total}件（{from} - {to} を表示）
      </Box>

      {mq ? (
        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap' }}>
          {data.texts.map((item) => {
            return <TextCard key={item.id} text={item} />;
          })}
        </Box>
      ) : (
        <Box sx={{ width: '100%', mb: 2, display: 'flex', flexFlow: 'column' }}>
          {data.texts.map((item) => {
            return <TextListItem key={item.id} text={item} />;
          })}
        </Box>
      )}

      {count > 1 && (
        <Pagination
          count={count}
          color='primary'
          onChange={(e, page) => {
            delete params.category1;
            delete params.category2;
            router.push('/search?' + new URLSearchParams({ ...params, page: page }).toString());
          }}
          page={+page}
        />
      )}
    </>
  );
};

export default SearchTextList;

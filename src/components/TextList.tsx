import { Box, Pagination, useMediaQuery } from '@mui/material';
import router from 'next/router';
import useSWR from 'swr';

import { getTextList } from 'api/getTextList';
import { pagenation } from 'utils/pagenation';

import CenterLoadingSpinner from './CenterLoadingSpinner';
import TextCard from './TextCard';
import TextListItem from './TextListItem';

const TextList = () => {
  const mq = useMediaQuery('(min-width:600px)');

  const page = router.query.page ?? 1;
  const type = router.query.type !== undefined ? router.query.type : 'latest';

  var category1 = '';
  var category2 = '';
  if (router.query.cat !== undefined) {
    category1 = router.query.cat[0];
    if (router.query.cat.length > 1) {
      category2 = router.query.cat[1];
    }
  }

  var thisPath = '';
  if (category1 !== '') thisPath += '/category/' + category1;
  if (category2 !== '') thisPath += '/' + category2;

  const params = { page: page, type: type, category1: category1, category2: category2 };

  var title;

  switch (type) {
    case 'ranking':
      title = '売れ筋のテキスト';
      break;
    case 'reviewed':
      title = '注目のテキスト';
      break;
    default:
      title = '最新のテキスト';
      break;
  }

  const { data, error } = useSWR(
    '/texts?' + new URLSearchParams(params).toString(),
    () => getTextList(params),
    {
      revalidateOnFocus: false,
    },
  );

  if (error) {
    console.log(error);
  }

  const DataContent = ({ data }) => {
    if (!data) return <CenterLoadingSpinner />;

    const { count, from, to } = pagenation(data.total, page, data.texts.length);

    return (
      <>
        <Box>
          {data.total}件のうち {from} - {to} 件
        </Box>
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

        {count > 1 && (
          <Pagination
            count={count}
            color='primary'
            onChange={(e, page) => {
              delete params.category1;
              delete params.category2;
              router.push(
                thisPath + '?more&' + new URLSearchParams({ ...params, page: page }).toString(),
              );
            }}
            page={+page}
          />
        )}
      </>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexFlow: 'column', width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        {mq ? <h5>{title}</h5> : <h6>{title}</h6>}
      </Box>
      <DataContent data={data} />
    </Box>
  );
};

export default TextList;

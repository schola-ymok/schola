import { Box, useMediaQuery } from '@mui/material';
import Link from 'next/link';
import router from 'next/router';
import useSWR from 'swr';

import { getTextList } from 'api/getTextList';

import CenterLoadingSpinner from './CenterLoadingSpinner';
import TextCard from './TextCard';
import TextListItem from './TextListItem';

const HomeTextList = ({ rootCategory, category }) => {
  const display_num_ranking = 5;
  const display_num_reviewed = 10;
  const display_num_latest = 20;
  const mq = useMediaQuery('(min-width:600px)');

  const { data: mostSoldTextList, mostSoldTextListError } = useSWR(
    `/ranking/${rootCategory}/${category}`,
    () =>
      getTextList({
        home: 1,
        type: 'ranking',
        category1: rootCategory,
        category2: category,
        limit: display_num_ranking,
      }),
    {
      revalidateOnFocus: false,
    },
  );
  const { data: mostReviewedTextList, mostReviewedTextListError } = useSWR(
    `/reviewed/${rootCategory}/${category}`,
    () =>
      getTextList({
        home: 1,
        type: 'reviewed',
        category1: rootCategory,
        category2: category,
        limit: display_num_reviewed,
      }),
    {
      revalidateOnFocus: false,
    },
  );
  const { data: latestTextList, latestTextListError } = useSWR(
    `/latest/${rootCategory}/${category}`,
    () =>
      getTextList({
        home: 1,
        category1: rootCategory,
        category2: category,
        limit: display_num_latest,
      }),
    {
      revalidateOnFocus: false,
    },
  );

  if (mostSoldTextListError || mostReviewedTextListError || latestTextListError) {
    console.log(mostSoldTextListError);
    console.log(mostReviewedTextListError);
    console.log(latestTextListError);
  }

  if (!mostSoldTextList || !mostReviewedTextList || !latestTextList)
    return <CenterLoadingSpinner />;

  const more = latestTextList.total > display_num_latest ? true : false;

  const TextBlock = (title, readMorePath, list, mq) => {
    return (
      <>
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          {mq ? <h5>{title}</h5> : <h6>{title}</h6>}
          {list.total > list.texts?.length && (
            <Box sx={{ ml: 1.5, mb: 0.4, fontSize: '0.9em' }}>
              <Link href={readMorePath}>
                <a>もっと見る</a>
              </Link>
            </Box>
          )}
        </Box>

        {mq ? (
          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap' }}>
            {list.texts?.map((item) => {
              return <TextCard text={item} />;
            })}
          </Box>
        ) : (
          <Box sx={{ width: '100%', mb: 2, display: 'flex', flexFlow: 'column' }}>
            {list.texts?.map((item) => {
              return <TextListItem text={item} />;
            })}
          </Box>
        )}
      </>
    );
  };

  const basePath = router.asPath + '?more&type=';
  return (
    <Box>
      {TextBlock('売れ筋ランキング', basePath + 'ranking', mostSoldTextList, mq)}
      {TextBlock('注目されているアイテム', basePath + 'reviewed', mostReviewedTextList, mq)}
      {TextBlock('新着アイテム', basePath + 'latest', latestTextList, mq)}
    </Box>
  );
};

export default HomeTextList;

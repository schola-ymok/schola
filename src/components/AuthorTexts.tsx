import { Box, useMediaQuery } from '@mui/material';
import router from 'next/router';

import ShowMore from 'components/ShowMore';

import TextCard from './TextCard';
import TextListItem from './TextListItem';

const AuthorTexts = ({ data, authorId, textId }) => {
  const mq = useMediaQuery('(min-width:1000px)');

  const _texts = JSON.parse(JSON.stringify(data.texts)); // deep copy

  const texts = _texts.filter((item) => {
    return item.id !== textId;
  });

  const displayNum = 6;
  const more = data.texts.length > displayNum;

  texts.splice(displayNum);

  const showMore = () => {
    if (!more) return null;
    return (
      <ShowMore
        onClick={() => {
          router.push(`/users/${authorId}/texts`);
        }}
      >
        著者の全てのテキストを参照
      </ShowMore>
    );
  };

  if (mq) {
    return (
      <>
        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap' }}>
          {texts.map((item) => {
            return <TextCard text={item} />;
          })}
        </Box>
        {showMore()}
      </>
    );
  } else {
    return (
      <Box sx={{ width: '100%', mb: 2, display: 'flex', flexFlow: 'column' }}>
        {texts.map((item) => {
          return <TextListItem text={item} />;
        })}
        {showMore()}
      </Box>
    );
  }
};

export default AuthorTexts;

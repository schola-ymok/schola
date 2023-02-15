import { Box, Link } from '@mui/material';
import { useRouter } from 'next/router';

import Consts from 'utils/Consts';

import TrialReadingAvailableLabel from './TrialReadingAvailableLabel';

const ChapterTitleRow = ({ chapter, eol, textId }) => {
  const rHeight = 40;

  const ChapterTitle = ({ chapter, textId }) => {
    const readableSx = {
      color: 'black',
      '&:hover': {
        color: Consts.COLOR.Primary,
        cursor: 'pointer',
      },
    };

    if (chapter.is_trial_reading_available) {
      return (
        <>
          <Link
            href={`/texts/${textId}/view?cid=${chapter.id}`}
            sx={{
              width: '100%',
              display: 'flex',
              textDecoration: 'none',
              '&:hover .child': {
                color: Consts.COLOR.Primary,
                textDecoration: 'none',
              },
              '&:hover': {
                textDecoration: 'none',
              },
            }}
          >
            <Box className='child' sx={readableSx}>
              {chapter.title}{' '}
            </Box>
            {chapter.is_trial_reading_available == 1 && (
              <TrialReadingAvailableLabel sx={{ ml: 1 }} />
            )}
          </Link>
        </>
      );
    } else {
      return <Box className='child'>{chapter.title} </Box>;
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          height: `${rHeight}px`,
          position: 'relative',
          color: '#aaaaaa',
        }}
      >
        <Box
          sx={{
            width: '10px',
            height: '10px',
            borderRadius: '5px',
            border: '2px solid #bccfcf',
            position: 'absolute',
            top: '10px',
            left: '4px',
          }}
        />
        {eol == false && (
          <Box
            sx={{
              height: `${rHeight - 10}px`,
              position: 'absolute',
              top: '20px',
              left: '8px',
              width: '2px',
              borderRight: '2px solid #bccfcf',
            }}
          />
        )}
        <Box
          sx={{
            width: '90%',
            fontWeight: 'bold',
            position: 'absolute',
            top: '4px',
            left: '25px',
            display: 'flex',
          }}
        >
          <ChapterTitle chapter={chapter} textId={textId} />
        </Box>
      </Box>
    </>
  );
};

const TocLine = ({ chapters, textId }) => {
  return (
    <>
      {chapters.map((item, index) => {
        return (
          <ChapterTitleRow textId={textId} chapter={item} eol={index == chapters.length - 1} />
        );
      })}
    </>
  );
};

export default TocLine;

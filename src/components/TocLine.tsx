import { Box } from '@mui/material';
import { useRouter } from 'next/router';

import Consts from 'utils/Consts';

import TrialReadingAvailableLabel from './TrialReadingAvailableLabel';

const ChapterTitleRow = ({ chapter, eol }) => {
  const rHeight = 40;

  let rSx = {
    display: 'flex',
    width: '100%',
    height: `${rHeight}px`,
    position: 'relative',
    color: '#aaaaaa',
  };

  if (chapter.is_trial_reading_available == 1) {
    rSx = {
      ...rSx,
      color: 'black',
      '&:hover': {
        cursor: 'pointer',
        color: Consts.COLOR.Primary,
      },
    };
  }

  return (
    <>
      <Box sx={rSx}>
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
            fontWeight: 'bold',
            position: 'absolute',
            top: '5px',
            left: '25px',
            display: 'flex',
          }}
        >
          <Box className='child'>{chapter.title} </Box>
          {chapter.is_trial_reading_available == 1 && <TrialReadingAvailableLabel sx={{ ml: 1 }} />}
        </Box>
      </Box>
    </>
  );
};

const TocLine = ({ chapters }) => {
  return (
    <>
      {chapters.map((item, index) => {
        return <ChapterTitleRow chapter={item} eol={index == chapters.length - 1} />;
      })}
    </>
  );
};

export default TocLine;

import { Box, Link } from '@mui/material';
import { height } from '@mui/system';

import TrialReadingAvailableLabel from 'components/TrialReadingAvailableLabel';

const ChapterTitleRow = ({ chapter, eol }) => {
  const rHeight = 25;

  let rSx = {
    display: 'flex',
    width: '100%',
    height: `${rHeight}px`,
    position: 'relative',
    mx: 1,
  };

  let dSx;
  let lSx;

  if (chapter.depth == 1) {
    dSx = {
      backgroundColor: '#444444',
    };
    lSx = {
      fontSize: '1.1em',
      fontWeight: 'bold',
    };
  } else if (chapter.depth == 2) {
    dSx = {
      backgroundColor: '#cccccc',
    };
    lSx = {
      fontWeight: 'bold',
    };
  } else if (chapter.depth == 3) {
    dSx = {
      backgroundColor: '#ffffff',
      border: '2px solid #cccccc',
    };
    lSx = {};
  }

  return (
    <>
      <Box sx={rSx}>
        <Box
          sx={{
            ...dSx,
            width: '6px',
            height: '6px',
            borderRadius: '3px',
            top: '11px',
            left: '6px',
            position: 'absolute',
          }}
        />
        {eol == false && (
          <Box
            sx={{
              height: `${rHeight - 8}px`,
              position: 'absolute',
              top: '18px',
              left: '8px',
              width: '2px',
              borderRight: '2px solid #cccccc',
            }}
          />
        )}
        <Box
          sx={{
            position: 'absolute',
            top: '1px',
            left: '25px',
            display: 'flex',
          }}
        >
          <Link href={'#' + chapter.id} sx={{ my: 'auto', ...lSx }}>
            <a>{chapter.title}</a>
          </Link>
        </Box>
      </Box>
    </>
  );
};

const TocLineBlock = ({ chapters, depth }) => {
  let lastChapterId = '';
  for (let i = 0; i < chapters.length; i++) {
    if (chapters[i].depth <= depth) lastChapterId = chapters[i].id;
  }

  return (
    <>
      {chapters.map((item) => {
        if (item.depth <= depth)
          return <ChapterTitleRow chapter={item} eol={item.id == lastChapterId} />;
      })}
    </>
  );
};

export default TocLineBlock;

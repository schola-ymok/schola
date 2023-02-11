import { Box, Link } from '@mui/material';

const querystring = require('querystring');

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

const TocLineBlock = ({ chapters, children }) => {
  let depth = 2;
  if (children?.length == 1) {
    const parse = querystring.parse(children[0]);
    if (!Number.isNaN(parseInt(parse.depth))) {
      depth = parseInt(parse.depth);
      if (depth < 1) depth = 1;
      if (depth > 3) depth = 3;
    }
  }

  let lastChapterIndex = 0;
  for (let i = 0; i < chapters.length; i++) {
    if (chapters[i].depth <= depth) lastChapterIndex = i;
  }

  return (
    <>
      {chapters.map((item, index) => {
        if (item.depth <= depth)
          return <ChapterTitleRow chapter={item} eol={index == lastChapterIndex} />;
      })}
    </>
  );
};

export default TocLineBlock;

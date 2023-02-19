import { Title } from '@mui/icons-material';
import { Box } from '@mui/material';
import Link from 'next/link';

import Consts from 'utils/Consts';

import TrialReadingAvailableLabel from './TrialReadingAvailableLabel';

const TitleRow = ({ item, eol, textId }) => {
  const rHeight = 30;

  const Title = ({ item, textId }) => {
    const ml = item.depth * 10 + 'px';
    const fw = item.depth == 0 ? 'bold' : 'normal';
    const baseSx = {
      ml: ml,
      fontWeight: fw,

      whiteSpace: 'nowrap',
      overflowX: 'auto',
    };

    const href =
      item.depth == 0
        ? `/texts/${textId}/view?cid=${item.chapterId}`
        : `/texts/${textId}/view?cid=${item.chapterId}#${item.sectionId}`;

    const readableSx = {
      color: 'black',
      '&:hover': {
        color: Consts.COLOR.Primary,
        cursor: 'pointer',
      },
    };

    if (item.trialReadingAvailable) {
      return (
        <Link href={href}>
          <a className='no-hover' style={{ width: '100%', display: 'inline-block' }}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexShrink: 0,
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
              <Box className='child scroll-without-bar' sx={{ ...baseSx, readableSx }}>
                {item.title}{' '}
              </Box>
              {item.trialReadingAvailable == 1 && item.depth == 0 && (
                <TrialReadingAvailableLabel sx={{ ml: 1 }} />
              )}
            </Box>
          </a>
        </Link>
      );
    } else {
      return (
        <Box sx={{ ...baseSx }} className='child'>
          {item.title}{' '}
        </Box>
      );
    }
  };

  const dotSx =
    item.depth == 0
      ? {
          width: '10px',
          height: '10px',
          borderRadius: '5px',
          border: '2px solid #bccfcf',
          backgroundColor: '#ffffff',
          position: 'absolute',
          top: '10px',
          left: '4px',
        }
      : {
          width: '6px',
          height: '6px',
          backgroundColor: '#bccfcf',
          borderRadius: '3px',
          border: '2px solid #bccfcf',
          position: 'absolute',
          top: '12px',
          left: '6px',
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
        <Box sx={dotSx} />
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
          <Title item={item} textId={textId} />
        </Box>
      </Box>
    </>
  );
};

const TocLine = ({ chapters, textId }) => {
  let titles = [];
  chapters.map((item) => {
    titles.push({
      depth: 0,
      title: item.title,
      chapterId: item.id,
      trialReadingAvailable: item.is_trial_reading_available,
    });
    if (item.toc) {
      const toc = JSON.parse(item.toc);
      toc.map((_item) => {
        if (_item.depth < 3) {
          titles.push({
            depth: _item.depth,
            title: _item.title,
            chapterId: item.id,
            sectionId: _item.id,
            trialReadingAvailable: item.is_trial_reading_available,
          });
        }
      });
    }
  });

  return (
    <>
      {titles.map((item, index) => {
        return <TitleRow textId={textId} item={item} eol={index == titles.length - 1} />;
      })}
    </>
  );
};

export default TocLine;

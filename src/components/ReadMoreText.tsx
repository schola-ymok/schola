import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/material';
import { useCallback, useState } from 'react';

import Consts from 'utils/Consts';

const ReadMoreText = ({ children, id, height, fontSize = '1.0em' }) => {
  const [more, setMore] = useState(false);
  const [overFlow, setOverFow] = useState(false);

  const SX = {
    mx: 'auto',
    fontWeight: 'bold',
    color: Consts.COLOR.Primary,
    cursor: 'pointer',
    '&:hover': {
      color: Consts.COLOR.PrimaryDark,
    },
    display: 'flex',
    justifyContent: 'center',
  };

  const ref = useCallback((node) => {
    if (node) {
      if (node.clientHeight > height - 1) setOverFow(true);
    }
  }, []);

  if (!overFlow) {
    return (
      <Box
        key={id}
        ref={ref}
        className='richtext'
        sx={{ fontSize: fontSize, wordBreak: 'break-all' }}
      >
        {children}
      </Box>
    );
  }

  if (!more) {
    return (
      <Box
        key={id}
        ref={ref}
        sx={{
          wordBreak: 'break-all',
          position: 'relative',
          maxHeight: height + 'px',
          overflowY: 'hidden',
          fontSize: fontSize,
        }}
      >
        <Box className='richtext'>{children}</Box>
        <Box
          sx={{
            wordBreak: 'break-all',
            position: 'absolute',
            bottom: 0,
            width: '100%',
            pt: '50px',
            pb: '0px',
            background:
              'linear-gradient(to bottom, rgb(255, 255, 255, 0) 0%, rgb(255, 255, 255, 1) 90%)',
            display: 'flex',
          }}
        >
          <Box
            onClick={() => {
              setMore(true);
            }}
            sx={SX}
          >
            <Box sx={{ mt: 'auto', fontSize: '0.9em' }}>もっと読む</Box>
            <ExpandMoreIcon sx={{ transform: 'scale(0.9)', mt: 'auto' }} />
          </Box>
        </Box>
      </Box>
    );
  } else {
    return (
      <>
        <Box className='richtext' key={id} sx={{ fontSize: fontSize }}>
          {children}
          <Box
            onClick={() => {
              setMore(false);
            }}
            sx={SX}
          >
            <Box sx={{ pt: 0.6, display: 'flex' }}>
              <Box sx={{ my: 'auto', fontSize: '0.9em' }}>表示を減らす</Box>
              <ExpandLessIcon sx={{ transform: 'scale(0.9)', my: 'auto' }} />
            </Box>
          </Box>
        </Box>
      </>
    );
  }
};

export default ReadMoreText;

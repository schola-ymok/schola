import { Box, Button } from '@mui/material';
import router from 'next/router';

import Consts from 'utils/Consts';

const DefaultButton = ({ onClick, children, disabled, exSx }) => {
  const _sx = {
    backgroundColor: Consts.COLOR.Primary,
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    px: 3,
    height: 40,
    whiteSpace: 'nowrap',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: Consts.COLOR.PrimaryDark,
    },
  };

  let sx = _sx;
  if (disabled) {
    sx.color = '#888888';
    sx.backgroundColor = '#cccccc';
    sx.cursor = 'default';
    sx['&:hover'] = 'unset';
  }

  return (
    <Box onClick={onClick} sx={{ ...sx, ...exSx }}>
      {children}
    </Box>
  );
};

export default DefaultButton;

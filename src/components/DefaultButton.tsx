import { Box, Button } from '@mui/material';
import router from 'next/router';

import Consts from 'utils/Consts';

const DefaultButton = ({ onClick, children, disabled, sx }) => {
  const __sx = {
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

  let _sx = __sx;
  if (disabled) {
    _sx.color = '#888888';
    _sx.backgroundColor = '#cccccc';
    _sx.cursor = 'default';
    _sx['&:hover'] = 'unset';
  }

  return (
    <Box
      onClick={() => {
        if (!disabled && onClick !== undefined) onClick();
      }}
      sx={{ ..._sx, ...sx }}
    >
      {children}
    </Box>
  );
};

export default DefaultButton;

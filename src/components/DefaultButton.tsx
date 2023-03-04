import { Button } from '@mui/material';

import Consts from 'utils/Consts';

const DefaultButton = ({ tabIndex, onClick, children, disabled, sx }) => {
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
    tabIndex: tabIndex,
    '&:hover': {
      backgroundColor: Consts.COLOR.PrimaryDark,
    },
    '&:focus': {
      backgroundColor: Consts.COLOR.PrimaryDark,
    },
  };

  let _sx = __sx;
  if (disabled) {
    _sx.color = '#888888';
    _sx.backgroundColor = '#cccccc';
    _sx.cursor = 'default';
    _sx['&:hover'] = {
      backgroundColor: '#cccccc',
    };
    _sx['&:focus'] = {
      backgroundColor: '#cccccc',
    };
  }

  return (
    <Button
      onClick={() => {
        if (!disabled && onClick !== undefined) onClick();
      }}
      sx={{ ..._sx, ...sx }}
    >
      {children}
    </Button>
  );
};

export default DefaultButton;

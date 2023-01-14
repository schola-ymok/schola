import { Box } from '@mui/material';

import Consts from 'utils/Consts';

const SMenuItem = ({ children, onClick, height = '36px' }) => (
  <Box
    onClick={onClick}
    sx={{
      display: 'flex',
      pl: 2,
      alignItems: 'center',
      height: height,
      '&:hover': {
        color: Consts.COLOR.Primary,
        backgroundColor: '#efefef',
        cursor: 'pointer',
      },
    }}
  >
    {children}
  </Box>
);

export default SMenuItem;

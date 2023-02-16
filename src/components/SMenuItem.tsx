import { Box } from '@mui/material';

import Consts from 'utils/Consts';

const SMenuItem = ({ children, onClick, height = '36px' }) => (
  <Box
    onClick={onClick}
    sx={{
      display: 'flex',
      px: 2,
      py: 0.5,
      alignItems: 'center',
      minHeight: height,
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

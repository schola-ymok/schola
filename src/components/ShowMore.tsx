import { Box } from '@mui/material';

import Consts from 'utils/Consts';

const ShowMore = ({ children, onClick }) => (
  <>
    <Box
      component='span'
      onClick={onClick}
      sx={{
        fontWeight: 'bold',
        color: Consts.COLOR.Primary,
        cursor: 'pointer',
        fontSize: '0.9em',
        '&:hover': {
          color: Consts.COLOR.PrimaryDark,
          textDecoration: 'underline',
        },
      }}
    >
      {children}
    </Box>
  </>
);

export default ShowMore;

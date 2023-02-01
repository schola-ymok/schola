import { Box, useMediaQuery } from '@mui/material';

import Logo from './Logo';
import SLogo from './SLogo';

const AdminHeader = () => {
  const mq = useMediaQuery('(min-width:600px)');

  return (
    <>
      <Box
        sx={{
          pt: { xs: 0, sm: 1 },
          pb: { xs: 0, sm: 1 },
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          height: '54px',
          whiteSpace: 'nowrap',
          px: { xs: 0.4, sm: 2 },
          my: { xs: 0.4, sm: 1 },
        }}
      >
        {mq ? <Logo /> : <SLogo />}
      </Box>
    </>
  );
};

export default AdminHeader;

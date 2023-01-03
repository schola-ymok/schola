import { Box, CircularProgress } from '@mui/material';
import Link from 'next/link';

const CenterLoadingSpinner = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '50vh',
      }}
    >
      <Box sx={{ mx: 'auto', my: 'auto' }}>
        <CircularProgress sx={{ mx: 'auto', my: 'auto' }} />
      </Box>
    </Box>
  );
};

export default CenterLoadingSpinner;

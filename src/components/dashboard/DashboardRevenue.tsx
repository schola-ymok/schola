import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext } from 'react';

import { AuthContext } from 'components/auth/AuthContext';

const DashboardRevenue = () => {
  const router = useRouter();

  const { authAxios } = useContext(AuthContext);

  return (
    <Box sx={{ display: 'flex', flexFlow: 'column', width: '100%', maxWidth: '700px' }}>
      <Box>
        <Box sx={{ fontSize: '1.2em', fontWeight: 'bold', mb: 1 }}>未実装：登録口座への送金</Box>
      </Box>
    </Box>
  );
};

export default DashboardRevenue;

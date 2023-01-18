import { Box } from '@mui/material';

import Footer from 'components/Footer';
import Header from 'components/headers/Header';
import HeaderWithMenuButton from 'components/headers/HeaderWithMenuButton';

const SideMenuLayout = ({ children }) => (
  <>
    <HeaderWithMenuButton />
    <Box sx={{ p: { xs: 0.4, sm: 2 } }}>{children}</Box>
    <Footer />
  </>
);

export default SideMenuLayout;

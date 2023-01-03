import { Box } from '@mui/material';

import Footer from 'components/Footer';
import EditTitleHeader from 'components/headers/EditTitleHeader';
import Header from 'components/headers/Header';

const EditTitleLayout = ({ children }) => (
  <>
    <EditTitleHeader />
    <Box sx={{ p: { xs: 0.4, sm: 2 } }}>{children}</Box>
  </>
);

export default EditTitleLayout;

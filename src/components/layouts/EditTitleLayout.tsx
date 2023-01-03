import { Box } from '@mui/material';

import EditTitleHeader from 'components/headers/EditTitleHeader';

const EditTitleLayout = ({ children }) => (
  <>
    <EditTitleHeader />
    <Box sx={{ p: { xs: 0.4, sm: 2 } }}>{children}</Box>
  </>
);

export default EditTitleLayout;

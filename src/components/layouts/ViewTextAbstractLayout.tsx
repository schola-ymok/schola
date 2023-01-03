import { Box } from '@mui/material';

import Footer from 'components/Footer';
import Header from 'components/headers/Header';

const ViewTextAbstractLayout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

export default ViewTextAbstractLayout;

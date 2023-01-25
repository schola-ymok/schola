import { Backdrop, CircularProgress } from '@mui/material';

import Consts from 'utils/Consts';

const LoadingBackDrop = () => (
  <Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
    <CircularProgress color='inherit' />
  </Backdrop>
);

export default LoadingBackDrop;

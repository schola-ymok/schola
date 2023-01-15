import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { IconButton } from '@mui/material';
import router from 'next/router';

import Consts from 'utils/Consts';

const BackButton = () => {
  return (
    <IconButton
      type='button'
      sx={{
        '&:hover': Consts.SX.IconButtonHover,
      }}
      onClick={() => {
        router.back();
      }}
    >
      <ArrowBackIosNewIcon sx={{ my: 'auto' }} />
    </IconButton>
  );
};

export default BackButton;

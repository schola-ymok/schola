import { Edit } from '@mui/icons-material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
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
      <ArrowBackIosIcon sx={{ my: 'auto' }} />
    </IconButton>
  );
};

export default BackButton;

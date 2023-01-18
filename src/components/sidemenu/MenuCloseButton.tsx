import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

import Consts from 'utils/Consts';

const MenuCloseButton = ({ onClick }) => (
  <IconButton
    type='button'
    sx={{
      p: 1,
      '&:hover': Consts.SX.IconButtonHover,
    }}
    onClick={onClick}
  >
    <CloseIcon sx={{ transform: 'scale(1.2)' }} />
  </IconButton>
);

export default MenuCloseButton;

import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from '@mui/material';

import Consts from 'utils/Consts';

const SideMenuIcon = ({ onClick }) => {
  return (
    <>
      <IconButton
        type='button'
        sx={{
          pr: 1,
          '&:hover': Consts.SX.IconButtonHover,
        }}
        onClick={onClick}
      >
        <MenuIcon sx={{ transform: 'scale(1.2)' }} />
      </IconButton>
    </>
  );
};

export default SideMenuIcon;

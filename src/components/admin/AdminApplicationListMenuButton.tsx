import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import { useContext, useState } from 'react';

import { AppContext } from 'states/store';
import Consts from 'utils/Consts';

import SMenuItem from '../SMenuItem';

const AdminApplicationListMenuButton = ({ handleApprove, handleReject }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <IconButton
        type='button'
        sx={{
          my: 'auto',
          p: 0,
          '&:hover': Consts.SX.IconButtonHover,
        }}
        onClick={handleMenu}
      >
        <ExpandMoreIcon />
      </IconButton>

      <Menu
        id='menu-appbar'
        anchorEl={anchorEl}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            border: '2px solid #aaaaaa',
            mt: 0.5,
            filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.32))',
            width: 150,
          },
        }}
      >
        <SMenuItem
          onClick={() => {
            handleApprove();
            handleClose();
          }}
          sx={{
            height: '30px',
            '&:hover': {
              color: Consts.COLOR.Primary,
            },
          }}
        >
          承認する
        </SMenuItem>
        <SMenuItem
          sx={{
            '&:hover': {
              color: Consts.COLOR.Primary,
            },
          }}
          onClick={() => {
            handleReject();
            handleClose();
          }}
        >
          差し戻す
        </SMenuItem>
      </Menu>
    </Box>
  );
};

export default AdminApplicationListMenuButton;

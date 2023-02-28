import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, IconButton, Menu } from '@mui/material';
import { useState } from 'react';

import Consts from 'utils/Consts';

import SMenuItem from '../SMenuItem';

const DashboardTextListMenuButton = ({ isReleased, handleDelete, handleEdit, handleView }) => {
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
        {isReleased == 1 && (
          <SMenuItem
            onClick={() => {
              handleView();
              handleClose();
            }}
            sx={{
              height: '30px',
              '&:hover': {
                color: Consts.COLOR.Primary,
              },
            }}
          >
            プレビュー
          </SMenuItem>
        )}
        <SMenuItem
          sx={{
            '&:hover': {
              color: Consts.COLOR.Primary,
            },
          }}
          onClick={() => {
            handleEdit();
            handleClose();
          }}
        >
          編集
        </SMenuItem>
        <SMenuItem
          sx={{
            '&:hover': {
              color: Consts.COLOR.Primary,
            },
          }}
          onClick={() => {
            handleDelete();
            handleClose();
          }}
        >
          削除
        </SMenuItem>
      </Menu>
    </Box>
  );
};

export default DashboardTextListMenuButton;

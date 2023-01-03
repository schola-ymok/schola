import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import { useContext, useState } from 'react';

import { AppContext } from 'states/store';
import Consts from 'utils/Consts';

const ChapterListMenuButton = ({ item, handleDelete, handleEdit }) => {
  const { state, dispatch } = useContext(AppContext);
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
          p: '7px',
          '&:hover': Consts.SX.IconButtonHover,
        }}
        onClick={handleMenu}
      >
        <MoreHorizIcon />
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
          horizontal: 'center',
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
        <MenuItem
          onClick={() => {
            handleClose();
          }}
          sx={{
            '&:hover': {
              color: Consts.COLOR.Primary,
            },
          }}
        >
          編集
        </MenuItem>
        <MenuItem
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
          試し読み可能に
        </MenuItem>
        <MenuItem
          sx={{
            '&:hover': {
              color: Consts.COLOR.Primary,
            },
          }}
          onClick={() => {
            handleDelete(item);
            handleClose();
          }}
        >
          削除
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ChapterListMenuButton;

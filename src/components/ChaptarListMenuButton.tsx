import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
  AppBar,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  styled,
  alpha,
  TextField,
  Avatar,
  useMediaQuery,
  Divider,
  Box,
} from '@mui/material';
import InputBase from '@mui/material/InputBase';
import { FirebaseSignInForm } from 'components/auth/FirebaseSignInForm';
import { getAuth, signOut } from 'firebase/auth';
import Link from 'next/link';
import router from 'next/router';
import { useState, useContext } from 'react';
import { AppContext } from 'states/store';
import Consts from 'utils/Consts';

import LoginButton from './headers/LoginButton';
import Logo from './headers/Logo';
import NotificationIcon from './headers/NotificationIcon';
import SearchBox from './headers/SearchBox';

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

import AccountCircle from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
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
import { getAuth, signOut } from 'firebase/auth';
import Link from 'next/link';
import router from 'next/router';
import { useState, useContext } from 'react';

import { FirebaseSignInForm } from 'components/auth/FirebaseSignInForm';
import { AppContext } from 'states/store';
import Consts from 'utils/Consts';

import LoginButton from './headers/LoginButton';
import Logo from './headers/Logo';
import NotificationIcon from './headers/NotificationIcon';
import SearchBox from './headers/SearchBox';

const HeaderAvatarButton = () => {
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
        {state.photoId ? (
          <Avatar
            sx={{ width: 40, height: 40 }}
            src={Consts.IMAGE_STORE_URL + state.photoId + '.png'}
          />
        ) : (
          <Avatar sx={{ width: 40, height: 40 }}>{state.accountName.substring(0, 2)}</Avatar>
        )}
      </IconButton>

      <Menu
        id='menu-appbar'
        anchorEl={anchorEl}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            border: '2px solid #aaaaaa',
            mt: 0.5,
            filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.32))',
            width: 200,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            router.push('/account');
            handleClose();
          }}
          sx={{
            '&:hover': {
              color: Consts.COLOR.Primary,
            },
          }}
        >
          <Stack>
            <Box
              sx={{
                fontSize: '0.9em',
                fontWeight: 'bold',
                overflowWrap: 'anywhere',
                whiteSpace: 'normal',
              }}
            >
              {state.displayName}
            </Box>
            <Box sx={{ fontSize: '0.6em', typography: 'subtitle2', color: '#aaaaaa' }}>
              {state.accountName}
            </Box>
          </Stack>
        </MenuItem>
        <Divider />
        <MenuItem
          sx={{
            '&:hover': {
              color: Consts.COLOR.Primary,
            },
          }}
          onClick={() => {
            router.push('/dashboard');
            handleClose();
          }}
        >
          ダッシュボード
        </MenuItem>
        <MenuItem
          sx={{
            '&:hover': {
              color: Consts.COLOR.Primary,
            },
          }}
          onClick={() => {
            router.push('/account/texts');
            handleClose();
          }}
        >
          購入済みテキスト
        </MenuItem>
        <MenuItem
          sx={{
            '&:hover': {
              color: Consts.COLOR.Primary,
            },
          }}
          onClick={() => {
            router.push('/signout');
            handleClose();
          }}
        >
          ログアウト
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default HeaderAvatarButton;

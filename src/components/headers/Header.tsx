import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
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
import AddNewTextButton from 'components/headers/AddNewTextButton';
import HeaderAvatarButton from 'components/headers/HeaderAvatarButton';
import LoginButton from 'components/headers/LoginButton';
import Logo from 'components/headers/Logo';
import NotificationIcon from 'components/headers/NotificationIcon';
import SearchBox from 'components/headers/SearchBox';
import { AppContext } from 'states/store';
import Consts from 'utils/Consts';

const Header = ({}) => {
  const { state, dispatch } = useContext(AppContext);

  return (
    <>
      <Stack sx={{ pt: { xs: 0, sm: 1 }, pb: { xs: 0, sm: 1 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            px: { xs: 0.4, sm: 2 },
          }}
        >
          <Logo />

          <Box
            sx={{
              display: { xs: 'none', sm: 'block' },
              ml: 2,
            }}
          >
            <SearchBox />
          </Box>

          <Box
            sx={{
              display: 'flex',
              marginLeft: 'auto',
              alignItems: 'center',
            }}
          >
            {state.isLoggedin ? (
              <>
                <NotificationIcon /> <HeaderAvatarButton /> <AddNewTextButton />
              </>
            ) : (
              <LoginButton />
            )}
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: 'block', sm: 'none' },
            m: 0.4,
          }}
        >
          <SearchBox fullWidth />
        </Box>
      </Stack>
    </>
  );
};

export default Header;

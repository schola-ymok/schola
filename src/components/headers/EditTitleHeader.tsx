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
import { AppContext } from 'states/store';
import Consts from 'utils/Consts';

import AddNewTextButton from './AddNewTextButton';
import AvatarIcon from './HeaderAvatarButton';
import BackButton from './BackButton';
import LoginButton from './LoginButton';
import Logo from './Logo';
import NotificationIcon from './NotificationIcon';
import SearchBox from './SearchBox';

const EditTitleHeader = () => {
  const { state, dispatch } = useContext(AppContext);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          pl: { xs: 1, sm: 2 },
          pr: { xs: 0.4, sm: 2 },
        }}
      >
        <BackButton />

        <Box
          sx={{
            display: 'flex',
            marginLeft: 'auto',
            alignItems: 'center',
          }}
        >
          {state.isLoggedin ? (
            <>
              <AvatarIcon />
            </>
          ) : (
            <LoginButton />
          )}
        </Box>
      </Box>
    </>
  );
};

export default EditTitleHeader;

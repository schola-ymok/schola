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

const AvatarButton = ({ photoId, onClick, size }) => {
  if (photoId) {
    return (
      <Avatar
        onClick={onClick}
        sx={{ width: size, height: size, cursor: 'pointer' }}
        src={Consts.IMAGE_STORE_URL + photoId + '.png'}
      />
    );
  } else {
    return (
      <Avatar onClick={onClick} sx={{ width: size, height: size, cursor: 'pointer' }}>
        aa
      </Avatar>
    );
  }
};

export default AvatarButton;

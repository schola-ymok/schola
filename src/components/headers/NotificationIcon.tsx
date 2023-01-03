import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
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
import Link from 'next/link';
import router from 'next/router';
import { useState, useContext } from 'react';
import { AppContext } from 'states/store';
import Consts from 'utils/Consts';

const NotificationIcon = ({ onClick }) => {
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
        <NotificationsOutlinedIcon sx={{ transform: 'scale(1.2)' }} />
      </IconButton>
    </>
  );
};

export default NotificationIcon;

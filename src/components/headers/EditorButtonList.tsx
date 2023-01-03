import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
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

const EditorButtonList = ({ onClick }) => {
  return (
    <>
      <IconButton
        type='button'
        sx={{
          '&:hover': Consts.SX.IconButtonHover,
        }}
        onClick={onClick}
      >
        <FormatListBulletedIcon sx={{ transform: 'scale(0.9)' }} />
      </IconButton>
    </>
  );
};

export default EditorButtonList;

import InsertPhotoIcon from '@mui/icons-material/InsertPhotoOutlined';
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

const EditorButtonImage = ({ handleSelectFile }) => {
  return (
    <>
      <IconButton
        type='button'
        component='label'
        sx={{
          '&:hover': Consts.SX.IconButtonHover,
        }}
      >
        <InsertPhotoIcon sx={{ transform: 'scale(0.9)' }} />
        <input
          type='file'
          accept='image/*'
          onChange={handleSelectFile}
          style={{ display: 'none' }}
        />
      </IconButton>
    </>
  );
};

export default EditorButtonImage;

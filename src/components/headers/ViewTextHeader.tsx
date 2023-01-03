import AccountCircle from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
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
  Switch,
  styled,
  alpha,
  Stack,
} from '@mui/material';
import InputBase from '@mui/material/InputBase';
import { getAuth, signOut } from 'firebase/auth';
import Link from 'next/link';
import router from 'next/router';
import { useState, useContext } from 'react';

import { FirebaseSignInForm } from 'components/auth/FirebaseSignInForm';
import { AppContext } from 'states/store';

const ViewTextHeader = ({ title }) => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          whiteSpace: 'nowrap',
          px: { xs: 0.4, sm: 2 },
          my: { xs: 0.4, sm: 1 },
        }}
      >
        <Box sx={{ fontSize: '1.7em', fontWeight: 'bold' }}>{title}</Box>
      </Box>
    </>
  );
};

export default ViewTextHeader;

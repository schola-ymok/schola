import { Box, IconButton, Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import { FirebaseSignInForm } from 'components/auth/FirebaseSignInForm';
import router from 'next/router';
import { useState, useContext } from 'react';
import Consts from 'utils/Consts';

const AddNewTextButton = () => {
  const handleNewText = () => {
    router.push('/texts/new');
  };

  return (
    <Button
      variant='contained'
      onClick={handleNewText}
      sx={{
        ml: 1,
        pr: 3,
        pl: 3,
        height: 40,
        whiteSpace: 'nowrap',
        fontWeight: 'bold',
      }}
    >
      作成
    </Button>
  );
};

export default AddNewTextButton;

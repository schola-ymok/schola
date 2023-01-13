import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { useState } from 'react';

import DefaultButton from 'components/DefaultButton';
import { FirebaseSignInForm } from 'components/auth/FirebaseSignInForm';

const LoginButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DefaultButton onClick={() => setOpen(true)}>ログイン</DefaultButton>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <FirebaseSignInForm />
        </DialogContent>
        <DialogActions>
          <DefaultButton onClick={() => setOpen(false)}>キャンセル</DefaultButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LoginButton;

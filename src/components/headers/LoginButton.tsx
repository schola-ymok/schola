import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { FirebaseSignInForm } from 'components/auth/FirebaseSignInForm';
import { useState } from 'react';

const LoginButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant='contained'
        onClick={() => setOpen(true)}
        sx={{ pr: 2, pl: 2, fontWeight: 'bold' }}
      >
        ログイン
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <FirebaseSignInForm />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LoginButton;

import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { useState } from 'react';

import { FirebaseSignInForm } from 'components/auth/FirebaseSignInForm';

const LoginButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant='contained'
        onClick={() => setOpen(true)}
        sx={{ pr: 3, pl: 3, fontWeight: 'bold', height: 40 }}
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

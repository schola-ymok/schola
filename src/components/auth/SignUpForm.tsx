import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';

import { createNewAccount } from 'api/createNewAcount';
import { AuthContext } from 'components/auth/AuthContext';
import { AppContext } from 'states/store';

import type { NextPage } from 'next';

export const SignUpForm: NextPage = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(AppContext);
  const [displayName, setDisplayName] = useState(state.displayName);
  const [accountName, setAccountName] = useState();
  const [status, setStatus] = useState('--');
  const { authAxios } = useContext(AuthContext);

  const onDisplayNameChange = (value) => {
    setDisplayName(value);
  };

  const onAccountChange = (value) => {
    setAccountName(value);
  };

  async function save() {
    const { userId, duplicate, error } = await createNewAccount(
      accountName,
      displayName,
      authAxios,
    );

    if (error) {
      setStatus('error');
      return;
    } else if (duplicate) {
      setStatus('duplicate');
      return;
    } else if (userId) {
      setStatus('complete');
      router.reload();
      //      return;
    }
  }

  return (
    <Box sx={{ display: 'flex', padding: '50px' }}>
      <Stack>
        <Box sx={{ display: 'flex', padding: '50px' }}>
          <Stack>
            <TextField
              id='ic'
              label='表示名'
              value={displayName ?? '-'}
              variant='standard'
              onChange={(e) => onDisplayNameChange(e.target.value)}
            />
            <TextField
              id='ic'
              label='アカウント名'
              variant='standard'
              onChange={(e) => onAccountChange(e.target.value)}
            />
            <p>{status}</p>
          </Stack>
        </Box>
        <Button variant='contained' onClick={() => save()}>
          保存
        </Button>
      </Stack>
    </Box>
  );
};

import { Box, CircularProgress, InputBase } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';

import { createNewAccount } from 'api/createNewAcount';
import { AuthContext } from 'components/auth/AuthContext';
import DefaultButton from 'components/DefaultButton';
import { AppContext } from 'states/store';
import Consts from 'utils/Consts';

import type { NextPage } from 'next';

export const SignUpForm: NextPage = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(AppContext);
  const [displayName, setDisplayName] = useState(state.displayName);
  const [accountName, setAccountName] = useState();
  const [result, setResult] = useState(null);
  const { authAxios } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonEnable, setButtonEnable] = useState(true);

  const onDisplayNameChange = (value) => {
    setDisplayName(value);
  };

  const onAccountChange = (value) => {
    setAccountName(value);
  };

  async function save() {
    setResult(null);
    setIsLoading(true);
    setButtonEnable(false);
    const { userId, duplicate, error } = await createNewAccount(
      accountName,
      displayName,
      authAxios,
    );

    if (error) {
      setResult('error');
      setIsLoading(false);
      setButtonEnable(true);
      return;
    } else if (duplicate) {
      setResult('duplicate');
      setIsLoading(false);
      setButtonEnable(true);
      return;
    } else if (userId) {
      setResult('complete');
      setIsLoading(false);
      router.reload();
    }
  }

  let resultMessage;
  switch (result) {
    case 'error':
      resultMessage = 'エラーが発生しました';
      break;
    case 'duplicate':
      resultMessage = 'すでに利用されているアカウント名です';
      break;
    case 'complete':
      resultMessage = 'ようこそ schola へ';
      break;
  }

  return (
    <Box sx={{ display: 'flex', flexFlow: 'column', width: '100%' }}>
      <Box sx={{ pt: 4, pb: 3, mx: 'auto' }}>
        <img src='/logo-icon.svg' width='100px' />
      </Box>
      <Box
        sx={{
          fontSize: { xs: '1.4em', sm: '2em' },
          fontWeight: 'bold',
          color: '#777777',
          mx: 'auto',
        }}
      >
        <Box sx={{ mx: 'auto', width: 'fit-content' }}>学びたいと思っていれば</Box>
        <Box sx={{ mx: 'auto', width: 'fit-content' }}>いつでも学べる</Box>
      </Box>

      <Box sx={{ mt: 3, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: 'fit-content', display: 'flex' }}>
          <Box
            sx={{
              width: 120,
              pr: 1.5,
              ml: 'auto',
              fontWeight: 'bold',
              mt: 2,
              mb: 1,
              mr: { xs: 'auto', md: 'unset' },
              textAlign: 'right',
            }}
          >
            アカウント名
          </Box>

          <Box
            sx={{
              p: 1,
              width: 200,
              border: '2px solid ' + Consts.COLOR.Grey,
              '&:hover': {
                border: '2px solid ' + Consts.COLOR.Primary,
              },
            }}
          >
            <InputBase
              placeholder='アカウント名'
              value={accountName}
              sx={{ fontSize: '1.0em' }}
              variant='outlined'
              fullWidth
              onChange={(e) => onAccountChange(e.target.value)}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 3, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: 'fit-content', display: 'flex' }}>
          <Box
            sx={{
              width: 120,
              pr: 1.5,
              ml: 'auto',
              fontWeight: 'bold',
              mt: 2,
              mb: 1,
              textAlign: 'right',
            }}
          >
            表示名
          </Box>

          <Box
            sx={{
              p: 1,
              width: 200,
              border: '2px solid ' + Consts.COLOR.Grey,
              '&:hover': {
                border: '2px solid ' + Consts.COLOR.Primary,
              },
            }}
          >
            <InputBase
              placeholder='表示名'
              value={displayName}
              sx={{ fontSize: '1.0em' }}
              variant='outlined'
              fullWidth
              onChange={(e) => onDisplayNameChange(e.target.value)}
            />
          </Box>
        </Box>
      </Box>

      {result && (
        <Box sx={{ p: 1, fontWeight: 'bold', color: Consts.COLOR.PrimaryDark, mx: 'auto', mt: 2 }}>
          {resultMessage}
        </Box>
      )}

      <DefaultButton
        disabled={!buttonEnable}
        variant='contained'
        sx={{ mx: 'auto', mt: 3, width: '100px' }}
        onClick={() => save()}
      >
        {isLoading ? <CircularProgress size={28} sx={{ color: 'white' }} /> : <>登録</>}
      </DefaultButton>
    </Box>
  );
};

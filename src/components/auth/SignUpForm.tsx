import CheckIcon from '@mui/icons-material/Check';
import { Box, CircularProgress, InputBase } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import { createNewAccount } from 'api/createNewAccount';
import DefaultButton from 'components/DefaultButton';
import FormItemLabel from 'components/FormItemLabel';
import FormItemState from 'components/FormItemState';
import FormItemSubLabel from 'components/FormItemSubLabel';
import { AuthContext } from 'components/auth/AuthContext';
import { AppContext } from 'states/store';
import Consts from 'utils/Consts';
import { validate } from 'utils/validate';

import type { NextPage } from 'next';

export const SignUpForm: NextPage = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(AppContext);
  const [displayName, setDisplayName] = useState(state.displayName);
  const [accountName, setAccountName] = useState('');
  const [result, setResult] = useState(null);
  const { authAxios } = useContext(AuthContext);

  const [isSaving, setIsSaving] = useState(false);
  const [isComplite, setIsComplete] = useState(false);

  const [displayNameValidation, setDisplayNameValidation] = useState(false);
  const [accountNameValidation, setAccountNameValidation] = useState(false);

  function checkValidation() {
    return displayNameValidation.ok && accountNameValidation.ok;
  }

  const onDisplayNameChange = (value) => {
    setDisplayName(value);
    setDisplayNameValidation(validate(value, Consts.VALIDATE.displayName));
  };

  const onAccountChange = (value) => {
    setAccountName(value);
    setAccountNameValidation(validate(value, Consts.VALIDATE.accountName));
  };

  async function save() {
    setResult(null);
    setIsSaving(true);
    const { userId, duplicate, error } = await createNewAccount(
      accountName,
      displayName,
      state.email,
      state.emailVerified,
      authAxios,
    );

    if (error) {
      setResult('error');
      setIsSaving(false);
      return;
    } else if (duplicate) {
      setResult('duplicate');
      setIsSaving(false);
      return;
    } else if (userId) {
      setResult('complete');
      setIsSaving(false);
      setIsComplete(true);
      router.reload();
    }
  }

  useEffect(() => {
    setDisplayNameValidation(validate(state.displayName, Consts.VALIDATE.displayName));
    setAccountNameValidation(validate(state.accountName, Consts.VALIDATE.accountName));
  }, []);

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

  let buttonContent;
  if (isSaving) {
    buttonContent = <CircularProgress size={28} sx={{ color: 'white' }} />;
  } else if (isComplite) {
    buttonContent = <CheckIcon sx={{ color: 'black' }} />;
  } else {
    buttonContent = <>登録</>;
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
        <Box sx={{ display: 'flex', flexFlow: 'column' }}>
          <FormItemLabel sx={{ mt: 1 }}>アカウント名</FormItemLabel>
          <FormItemSubLabel>
            アカウント名を{Consts.VALIDATE.accountName.min}～{Consts.VALIDATE.accountName.max}
            文字で入力
          </FormItemSubLabel>
          <Box
            sx={{
              p: 1,
              width: 250,
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
          <FormItemState validation={accountNameValidation} />
        </Box>
      </Box>

      <Box sx={{ mt: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', flexFlow: 'column' }}>
          <FormItemLabel>表示名</FormItemLabel>
          <FormItemSubLabel>
            表示名を{Consts.VALIDATE.displayName.min}～{Consts.VALIDATE.displayName.max}
            文字で入力
          </FormItemSubLabel>
          <Box
            sx={{
              p: 1,
              width: 250,
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
          <FormItemState validation={displayNameValidation} />
        </Box>
      </Box>

      <DefaultButton
        disabled={isSaving || !checkValidation() || isComplite}
        variant='contained'
        sx={{ mx: 'auto', mt: 4, width: '100px' }}
        onClick={() => save()}
      >
        {buttonContent}
      </DefaultButton>

      {result && (
        <Box sx={{ p: 1, fontWeight: 'bold', color: Consts.COLOR.PrimaryDark, mx: 'auto', mt: 2 }}>
          {resultMessage}
        </Box>
      )}
    </Box>
  );
};

import { title } from 'process';

import { Box, CircularProgress, Dialog, DialogActions, InputBase } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import { changeAccount } from 'api/changeAccount';
import { AuthContext } from 'components/auth/AuthContext';
import Consts from 'utils/Consts';
import { validate } from 'utils/validate';

import DefaultButton from './DefaultButton';
import FormItemLabel from './FormItemLabel';
import FormItemState from './FormItemState';
import FormItemSubLabel from './FormItemSubLabel';

const AccountNameSettingDialog = ({ rkey, open, onClose, name, onChange }) => {
  const router = useRouter();
  const { authAxios } = useContext(AuthContext);
  const [newName, setNewName] = useState(name);
  const [oldName, setOldName] = useState(name);

  const errorLabels = {
    duplicate: 'すでに利用されているアカウント名です',
    error: 'エラーが発生しました',
  };

  const [nameValidation, setNameValidation] = useState(
    validate(title, Consts.VALIDATE.chapterTitle),
  );

  const [result, setResult] = useState();
  const [loading, setIsLoading] = useState(false);

  async function change() {
    setResult(null);
    setIsLoading(true);
    const { duplicate, error } = await changeAccount(newName, authAxios);
    if (error) {
      setResult('error');
      setIsLoading(false);
    } else if (duplicate) {
      setResult('duplicate');
      setIsLoading(false);
    } else {
      onClose();
      router.reload();
    }
  }

  useEffect(() => {
    if (open) {
      setNewName(name);
      setNameValidation(validate(name, Consts.VALIDATE.accountName));
    }
  }, [open]);

  const onNameChange = (e) => {
    setNewName(e.target.value);
    setNameValidation(validate(e.target.value, Consts.VALIDATE.accountName));
    setResult(null);
  };

  const SubmitButton = () => {
    if (loading) {
      return (
        <DefaultButton sx={{ width: '90px', mr: 1, mb: 1 }}>
          <CircularProgress size={24} sx={{ p: 0, m: 0, color: 'white' }} />
        </DefaultButton>
      );
    } else {
      return (
        <DefaultButton
          sx={{ width: '90px', mr: 1, mb: 1 }}
          disabled={!nameValidation?.ok || oldName == newName}
          onClick={() => {
            change();
          }}
        >
          OK
        </DefaultButton>
      );
    }
  };

  return (
    <Dialog key={rkey} fullWidth open={open} onClose={onClose}>
      <Box
        sx={{
          m: { xs: 1, sm: 3 },
        }}
      >
        <FormItemLabel>アカウント名</FormItemLabel>
        <FormItemSubLabel>
          アカウント名を{Consts.VALIDATE.accountName.min}～{Consts.VALIDATE.accountName.max}
          文字で入力
        </FormItemSubLabel>
        <Box
          sx={{
            p: 1,
            t: 0.5,
            border: '2px solid ' + Consts.COLOR.Grey,
            '&:hover': {
              border: '2px solid ' + Consts.COLOR.Primary,
            },
          }}
        >
          <InputBase
            autoFocus
            placeholder='アカウント名'
            pattern='^[0-9a-zA-Z]+$'
            value={newName}
            variant='outlined'
            fullWidth
            onChange={onNameChange}
          />
        </Box>
        {result == 'duplicate' || result == 'error' ? (
          <Box sx={{ fontSize: '0.8em', color: '#aa0000' }}>{errorLabels[result]}</Box>
        ) : (
          <FormItemState validation={nameValidation} />
        )}
      </Box>
      <DialogActions>
        <DefaultButton
          sx={{ mb: 1 }}
          onClick={() => {
            onClose();
          }}
        >
          キャンセル
        </DefaultButton>
        <SubmitButton />
      </DialogActions>
    </Dialog>
  );
};

export default AccountNameSettingDialog;

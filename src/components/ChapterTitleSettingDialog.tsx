
import { Box, Dialog, DialogActions, InputBase } from '@mui/material';
import { useEffect, useState } from 'react';

import Consts from 'utils/Consts';
import { validate } from 'utils/validate';

import DefaultButton from './DefaultButton';
import FormItemLabel from './FormItemLabel';
import FormItemState from './FormItemState';
import FormItemSubLabel from './FormItemSubLabel';

const ChapterTitleSettingDialog = ({ key, open, onClose, title, onChange }) => {
  const [newTitle, setNewTitle] = useState(title);
  const [oldTitle, setOldTitle] = useState(title);

  const [titleValidation, setTitleValidation] = useState(
    validate(title, Consts.VALIDATE.chapterTitle),
  );

  useEffect(() => {
    if (open) {
      setNewTitle(title);
      setTitleValidation(validate(title, Consts.VALIDATE.chapterTitle));
    }
  }, [open]);

  const onTitleChange = (e) => {
    setNewTitle(e.target.value);
    setTitleValidation(validate(e.target.value, Consts.VALIDATE.chapterTitle));
  };

  return (
    <Dialog key={key} fullWidth open={open} onClose={onClose}>
      <Box
        sx={{
          m: { xs: 1, sm: 3 },
        }}
      >
        <FormItemLabel>チャプタータイトル</FormItemLabel>
        <FormItemSubLabel>
          チャプターのタイトルを{Consts.VALIDATE.chapterTitle.min}～
          {Consts.VALIDATE.chapterTitle.max}文字で入力
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
            placeholder='チャプターのタイトル'
            value={newTitle}
            variant='outlined'
            fullWidth
            onChange={onTitleChange}
          />
        </Box>
        <FormItemState validation={titleValidation} />
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
        <DefaultButton
          sx={{ mr: 1, mb: 1 }}
          disabled={!titleValidation?.ok || oldTitle == newTitle}
          onClick={() => {
            onChange(newTitle);
            onClose();
          }}
        >
          OK
        </DefaultButton>
      </DialogActions>
    </Dialog>
  );
};

export default ChapterTitleSettingDialog;

import { Box, InputBase, Dialog, DialogActions, DialogContent } from '@mui/material';
import { useState } from 'react';

import Consts from 'utils/Consts';

import DefaultButton from './DefaultButton';

const ChapterTitleSettingDialog = ({ open, onClose, title, onChange }) => {
  const [newTitle, setNewTitle] = useState(title);

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <Box
        sx={{
          m: { xs: 1, sm: 3 },
        }}
      >
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
            onChange={(e) => {
              setNewTitle(e.target.value);
            }}
          />
        </Box>
      </Box>
      <DialogActions>
        <DefaultButton onClick={onClose}>キャンセル</DefaultButton>
        <DefaultButton
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

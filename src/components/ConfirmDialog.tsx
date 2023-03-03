import { Box, Dialog, DialogActions } from '@mui/material';

import DefaultButton from './DefaultButton';

const ConfirmDialog = ({ title, message, open, onClose, onOk }) => (
  <Dialog fullWidth open={open} onClose={onClose}>
    <Box
      sx={{
        m: { xs: 1, sm: 3 },
      }}
    >
      <Box sx={{ fontSize: '1.5em', fontWeight: 'bold' }}>{title}</Box>
      <Box sx={{ fontSize: '1.0em', mt: 1 }}>{message}</Box>
    </Box>
    <DialogActions>
      <DefaultButton sx={{ mb: 1 }} onClick={onClose}>
        キャンセル
      </DefaultButton>
      <DefaultButton sx={{ mb: 1, mr: 1 }} onClick={onOk}>
        OK
      </DefaultButton>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;

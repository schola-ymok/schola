import { Box, Dialog, DialogActions } from '@mui/material';

import DefaultButton from './DefaultButton';

const ApplicationConfirmDialog = ({ open, onClose, onOk }) => (
  <Dialog fullWidth open={open} onClose={onClose}>
    <Box
      sx={{
        m: { xs: 1, sm: 3 },
      }}
    >
      <Box sx={{ fontSize: '1.5em', fontWeight: 'bold', mx: 'auto', textAlign: 'center' }}>
        販売審査に提出
      </Box>
      <Box sx={{ fontSize: '1.0em', mt: 2 }}>
        販売審査が完了すると、テキストの公開と販売が開始します。
      </Box>
      <Box sx={{ fontSize: '1.0em', mt: 1, ml: 3 }}>
        <ul>
          <li>
            テキストの内容が&nbsp;
            <a href='/info/md/guide' target='_blank' style={{ color: '#2f62ca' }}>
              <b>ガイドライン</b>
            </a>
            &nbsp;に沿っているかご確認ください。
          </li>
          <li>審査には１～２日要する場合があります。</li>
          <li>審査中はテキストの編集ができなくなります。</li>
        </ul>
      </Box>
    </Box>
    <DialogActions>
      <DefaultButton sx={{ mb: 1, ml: 'auto' }} onClick={onClose}>
        キャンセル
      </DefaultButton>
      <DefaultButton sx={{ mb: 1, mr: 1, mr: 'auto' }} onClick={onOk}>
        OK
      </DefaultButton>
    </DialogActions>
  </Dialog>
);

export default ApplicationConfirmDialog;

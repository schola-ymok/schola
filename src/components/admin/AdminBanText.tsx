import { Box, InputBase, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';

import { banText } from 'api/banText';
import { AuthContext } from 'components/auth/AuthContext';
import DefaultButton from 'components/DefaultButton';
import LoadingBackDrop from 'components/LoadingBackDrop';
import RTEditor from 'components/rteditor/RTEditor';
import Consts from 'utils/Consts';

const AdminBanText = () => {
  const router = useRouter();

  const page = router.query.page ?? 1;
  const { authAxios } = useContext(AuthContext);

  const [snack, setSnack] = useState({ open: false, message: '' });
  const [textId, setTextId] = useState();
  const [reasonText, setReasonText] = useState();

  const [loading, setLoading] = useState(false);

  const onTextIdChange = (e) => {
    setTextId(e.target.value);
  };

  const handleBan = async () => {
    setLoading(true);

    const { error } = await banText(authAxios, textId, reasonText);
    if (error) {
      setLoading(false);
      setSnack({ open: true, message: 'エラーが発生しました' });
      return;
    }

    setSnack({ open: true, message: '公開を停止しました' });
    setLoading(false);
  };

  return (
    <Box sx={{ display: 'flex', flexFlow: 'column', width: '100%' }}>
      {loading && <LoadingBackDrop />}
      <Box
        sx={{
          p: 1,
          width: '250px',
          border: '2px solid ' + Consts.COLOR.Grey,
          '&:hover': {
            border: '2px solid ' + Consts.COLOR.Primary,
          },
        }}
      >
        <InputBase
          placeholder='公開を停止するテキストのID'
          value={textId}
          variant='outlined'
          fullWidth
          onChange={onTextIdChange}
        />
      </Box>
      <Box sx={{ width: '70%', mt: 1 }}>
        <RTEditor
          placeholder='公開停止の理由を入力してください'
          initialValue={reasonText}
          onChange={(value) => {
            setReasonText(value);
          }}
        />
      </Box>
      <DefaultButton onClick={handleBan} sx={{ width: '180px', mt: 1 }}>
        公開を停止する
      </DefaultButton>
      <Snackbar
        open={snack.open}
        message={snack.message}
        autoHideDuration={1000}
        onClose={() => setSnack({ open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default AdminBanText;

import { Box, InputBase, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';

import { banUser } from 'api/banUser';
import { AuthContext } from 'components/auth/AuthContext';
import DefaultButton from 'components/DefaultButton';
import LoadingBackDrop from 'components/LoadingBackDrop';
import Consts from 'utils/Consts';

const AdminBanUser = () => {
  const router = useRouter();

  const page = router.query.page ?? 1;
  const { authAxios } = useContext(AuthContext);

  const [snack, setSnack] = useState({ open: false, message: '' });
  const [userId, setUserId] = useState();

  const [loading, setLoading] = useState(false);

  const onUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  const handleBan = async () => {
    setLoading(true);

    const { error } = await banUser(authAxios, userId);
    if (error) {
      setLoading(false);
      setSnack({ open: true, message: 'エラーが発生しました' });
      return;
    }

    setSnack({ open: true, message: 'アカウントを凍結しました' });
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
          placeholder='凍結するユーザのID'
          value={userId}
          variant='outlined'
          fullWidth
          onChange={onUserIdChange}
        />
      </Box>
      <DefaultButton onClick={handleBan} sx={{ width: '190px', mt: 1 }}>
        アカウントを凍結する
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

export default AdminBanUser;

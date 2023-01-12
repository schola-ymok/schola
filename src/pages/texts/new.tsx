import { Box, Button, CircularProgress, InputBase } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';

import { createNewText } from 'api/createNewText';
import DefaultButton from 'components/DefaultButton';
import { AuthContext } from 'components/auth/AuthContext';
import EditTitleLayout from 'components/layouts/EditTitleLayout';
import Consts from 'utils/Consts';

import type { NextPage } from 'next';

const AddText: NextPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { authAxios } = useContext(AuthContext);

  async function handleAddText() {
    setIsLoading(true);
    const { textId, error } = await createNewText(title, authAxios);

    if (error) {
      console.log(error);
      return;
    }

    router.push(`/texts/${textId}/edit`);
  }

  return (
    <Box sx={{ display: 'flex', flexFlow: 'column', justifyContent: 'center', width: '100%' }}>
      <Box
        sx={{
          mt: 5,
          p: 1,
          width: 600,
          maxWidth: '90%',
          mx: 'auto',
          border: '2px solid ' + Consts.COLOR.Grey,
          '&:hover': {
            border: '2px solid ' + Consts.COLOR.Primary,
          },
        }}
      >
        <InputBase
          placeholder='タイトルを入力'
          rows={2}
          multiline
          fullWidth
          sx={{ fontSize: '1.3em', fontWeight: 'bold' }}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      </Box>

      <Box sx={{ mx: 'auto', mt: 3 }}>
        <DefaultButton onClick={handleAddText} width='200px'>
          {isLoading ? (
            <CircularProgress size={28} sx={{ color: 'white' }} />
          ) : (
            <>テキストを作成する</>
          )}
        </DefaultButton>
      </Box>
    </Box>
  );
};

AddText.getLayout = (page) => <EditTitleLayout>{page}</EditTitleLayout>;
export default AddText;

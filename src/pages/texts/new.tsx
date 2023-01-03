import {
  Card,
  Box,
  Button,
  Checkbox,
  Snackbar,
  CardContent,
  Stack,
  Link,
  Grid,
  Rating,
  TextField,
  Typography,
  InputBase,
  CircularProgress,
} from '@mui/material';
import error from 'next/error';
import router, { useRouter } from 'next/router';
import { useState, useContext, useEffect } from 'react';
import useSWR from 'swr';

import { createNewText } from 'api/createNewText';
import HomeTextList from 'components/HomeTextList';
import TextCard from 'components/TextCard';
import { AuthContext } from 'components/auth/AuthContext';
import EditTitleLayout from 'components/layouts/EditTitleLayout';
import Layout from 'components/layouts/Layout';
import RootCategory from 'components/sidemenu/RootCategory';
import Consts from 'utils/Consts';
import { pagenation } from 'utils/pagenation';

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
          width: 400,
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
          rows={4}
          multiline
          fullWidth
          sx={{ fontSize: '1.3em', fontWeight: 'bold' }}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      </Box>

      <Button
        variant='contained'
        size='small'
        sx={{
          width: 200,
          height: 40,
          mx: 'auto',
          fontSize: '1.1em',
          fontWeight: 'bold',
          mt: 3,
          mb: 20,
        }}
        onClick={handleAddText}
      >
        {isLoading ? (
          <CircularProgress size={28} sx={{ color: 'white' }} />
        ) : (
          <>テキストを作成する</>
        )}
      </Button>
    </Box>
  );
};

AddText.getLayout = (page) => <EditTitleLayout>{page}</EditTitleLayout>;
export default AddText;

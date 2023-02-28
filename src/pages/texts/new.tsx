import { Box, CircularProgress, InputBase } from '@mui/material';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';

import { createNewText } from 'api/createNewText';
import { AuthContext } from 'components/auth/AuthContext';
import DefaultButton from 'components/DefaultButton';
import FormItemLabel from 'components/FormItemLabel';
import FormItemState from 'components/FormItemState';
import FormItemSubLabel from 'components/FormItemSubLabel';
import EditTitleLayout from 'components/layouts/EditTitleLayout';
import Consts from 'utils/Consts';
import { validate } from 'utils/validate';

import type { NextPage } from 'next';

const AddText: NextPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState();
  const [titleValidation, setTitleValidation] = useState(validate('', Consts.VALIDATE.textTitle));

  const [isLoading, setIsLoading] = useState(false);
  const { authAxios } = useContext(AuthContext);

  async function handleAddText() {
    if (isLoading) return;
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
      <Box sx={{ width: '90%', maxWidth: '600px', mx: 'auto' }}>
        <FormItemLabel>テキストのタイトル</FormItemLabel>
        <FormItemSubLabel>
          テキストのタイトルを{Consts.VALIDATE.textTitle.min}～{Consts.VALIDATE.textTitle.max}
          文字で入力
        </FormItemSubLabel>
        <Box
          sx={{
            p: 1,
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
              setTitleValidation(validate(e.target.value, Consts.VALIDATE.textTitle));
            }}
          />
        </Box>
        <FormItemState validation={titleValidation} />
      </Box>

      <Box sx={{ mx: 'auto', mt: 3 }}>
        <DefaultButton
          disabled={!titleValidation.ok}
          onClick={handleAddText}
          sx={{ width: '200px' }}
        >
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

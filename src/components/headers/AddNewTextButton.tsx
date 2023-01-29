import { Box, Button } from '@mui/material';
import router from 'next/router';

import DefaultButton from 'components/DefaultButton';
import Consts from 'utils/Consts';

const AddNewTextButton = () => {
  const handleNewText = () => {
    router.push('/texts/new');
  };

  return (
    <DefaultButton onClick={handleNewText} sx={{ ml: 1, width: '76px' }}>
      作成
    </DefaultButton>
  );
};

export default AddNewTextButton;

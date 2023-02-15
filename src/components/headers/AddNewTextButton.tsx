import { Box, Button, Link } from '@mui/material';
import router from 'next/router';

import DefaultButton from 'components/DefaultButton';
import Consts from 'utils/Consts';

const AddNewTextButton = () => {
  const handleNewText = () => {
    router.push('/texts/new');
  };

  return (
    <DefaultButton sx={{ ml: 1, width: '76px' }} onClick={handleNewText}>
      作成
    </DefaultButton>
  );
};

export default AddNewTextButton;

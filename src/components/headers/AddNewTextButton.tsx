import { Button } from '@mui/material';
import router from 'next/router';

const AddNewTextButton = () => {
  const handleNewText = () => {
    router.push('/texts/new');
  };

  return (
    <Button
      variant='contained'
      onClick={handleNewText}
      sx={{
        ml: 1,
        pr: 3,
        pl: 3,
        height: 40,
        whiteSpace: 'nowrap',
        fontWeight: 'bold',
      }}
    >
      作成
    </Button>
  );
};

export default AddNewTextButton;

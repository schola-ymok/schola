import {
    Box, Button, useMediaQuery
} from '@mui/material';
import InputBase from '@mui/material/InputBase';
import { useContext, useState } from 'react';

import { AppContext } from 'states/store';

import BackButton from './BackButton';

const EditChapterHeader = ({ handleSaveClick, handleTitleChange, title }) => {
  const { state, dispatch } = useContext(AppContext);
  const [toggleViewModeValue, setToggleViewModeValue] = useState('both');
  const [enableSave, setEnableSave] = useState(true);

  const mq = useMediaQuery('(min-width:600px)');

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        px: 1,
      }}
    >
      <BackButton />

      <Box sx={{ fontSize: '1.0em', ml: 2, py: 0.5, width: '100%', my: 'auto' }}>
        <InputBase
          placeholder='チャプターのタイトルを入力'
          value={title}
          variant='outlined'
          fullWidth
          onChange={handleTitleChange}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          marginLeft: 'auto',
          alignItems: 'center',
        }}
      >
        <Button
          variant='contained'
          disabled={!enableSave}
          onClick={handleSaveClick}
          sx={{
            ml: 1,
            pr: 3,
            pl: 3,
            height: 30,
            whiteSpace: 'nowrap',
            fontWeight: 'bold',
          }}
        >
          保存
        </Button>
      </Box>
    </Box>
  );
};

export default EditChapterHeader;

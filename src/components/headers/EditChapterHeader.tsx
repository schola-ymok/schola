import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Box, Button, useMediaQuery, IconButton, InputBase } from '@mui/material';
import router, { useRouter } from 'next/router';
import { useContext, useState } from 'react';

import { AppContext } from 'states/store';
import Consts from 'utils/Consts';

import BackButton from './BackButton';

const EditChapterHeader = ({ handleSaveClick, handleTitleChange, title, textId, chapterId }) => {
  const { state, dispatch } = useContext(AppContext);
  const [toggleViewModeValue, setToggleViewModeValue] = useState('both');
  const [enableSave, setEnableSave] = useState(true);

  const mq = useMediaQuery('(min-width:600px)');
  const router = useRouter();

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

      <Box sx={{ width: '100%', my: 'auto', py: 0.5 }}>
        <InputBase
          placeholder='チャプターのタイトルを入力'
          value={title}
          sx={{ fontSize: '0.9em', my: 'auto' }}
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

        <IconButton
          type='button'
          sx={{
            '&:hover': Consts.SX.IconButtonHover,
          }}
          onClick={() => {
            router.push(`/texts/${textId}/view?cid=${chapterId}`);
          }}
        >
          <RemoveRedEyeIcon sx={{ my: 'auto' }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default EditChapterHeader;

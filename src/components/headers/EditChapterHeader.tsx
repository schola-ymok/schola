import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import InsertPhotoIcon from '@mui/icons-material/InsertPhotoOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Box, useMediaQuery, IconButton, InputBase, CircularProgress } from '@mui/material';
import router, { useRouter } from 'next/router';
import { useContext, useState } from 'react';

import { AppContext } from 'states/store';
import Consts from 'utils/Consts';

const EditChapterHeader = ({
  handleSaveClick,
  handleSelectFile,
  handleBackClick,
  handleModeChange,
  textId,
  chapterId,
  isSaving,
  changed,
}) => {
  const router = useRouter();

  const [mode, setMode] = useState(0);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: '32px',
        px: 1,
      }}
    >
      <Box sx={{ display: 'flex' }}>
        <BackButton onClick={handleBackClick} />
        <ImageButton handleSelectFile={handleSelectFile} />
      </Box>

      <Box sx={{ display: 'flex' }}>
        <ModeEditButton mode={mode} setMode={setMode} handleModeChange={handleModeChange} />
        <ModeMultiButton mode={mode} setMode={setMode} handleModeChange={handleModeChange} />
        <ModeViewButton mode={mode} setMode={setMode} handleModeChange={handleModeChange} />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <ViewButton
          onClick={() => {
            router.push(`/texts/${textId}/view?cid=${chapterId}`);
          }}
        />

        {isSaving ? (
          <CircularProgress size={15} sx={{ mx: '6px', color: 'black' }} />
        ) : (
          <SaveButton onClick={handleSaveClick} disabled={!changed} />
        )}
      </Box>
    </Box>
  );
};

const TButton = ({ children, onClick, selected = false, disabled }) => {
  let sx = {
    width: '24px',
    height: '24px',
    display: 'flex',
    m: 0.2,
    borderRadius: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      color: Consts.COLOR.Primary,
      cursor: 'pointer',
      backgroundColor: '#eeeeee',
    },
  };

  if (selected) sx.backgroundColor = '#eeeeee';

  if (disabled) {
    sx['color'] = '#cccccc';
    sx['&:hover'] = '';
  }

  return (
    <Box sx={sx} onClick={onClick}>
      {children}
    </Box>
  );
};

const BackButton = ({ onClick }) => (
  <TButton onClick={onClick}>
    <ChevronLeftIcon sx={{ transform: 'scale(1.0)' }} />
  </TButton>
);

const ViewButton = ({ onClick }) => (
  <TButton onClick={onClick}>
    <VisibilityOutlinedIcon sx={{ transform: 'scale(0.7)' }} />
  </TButton>
);

const SaveButton = ({ onClick, disabled }) => (
  <TButton onClick={onClick} disabled={disabled}>
    <SaveOutlinedIcon sx={{ transform: 'scale(0.7)' }} />
  </TButton>
);

const ModeMultiButton = ({ mode, setMode, handleModeChange }) => {
  const selected = mode == 0;
  return (
    <TButton
      selected={selected}
      onClick={() => {
        setMode(0);
        handleModeChange(0);
      }}
    >
      <img src='/split_middle.svg' />
    </TButton>
  );
};

const ModeEditButton = ({ mode, setMode, handleModeChange }) => {
  const selected = mode == 1;
  return (
    <TButton
      selected={selected}
      onClick={() => {
        setMode(1);
        handleModeChange(1);
      }}
    >
      <img src='/split_right.svg' />
    </TButton>
  );
};

const ModeViewButton = ({ mode, setMode, handleModeChange }) => {
  const selected = mode == 2;
  return (
    <TButton
      selected={selected}
      onClick={() => {
        setMode(2);
        handleModeChange(2);
      }}
    >
      <img src='/split_left.svg' />
    </TButton>
  );
};

const ImageButton = ({ onClick, handleSelectFile }) => (
  <Box component='label'>
    <TButton onClick={onClick}>
      <InsertPhotoIcon sx={{ transform: 'scale(0.7)' }} />
      <input type='file' accept='image/*' onChange={handleSelectFile} style={{ display: 'none' }} />
    </TButton>
  </Box>
);

export default EditChapterHeader;

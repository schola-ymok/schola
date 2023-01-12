import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CheckIcon from '@mui/icons-material/Check';
import { Box, CircularProgress, ToggleButton, ToggleButtonGroup } from '@mui/material';
import router from 'next/router';
import { useState } from 'react';

import DefaultButton from 'components/DefaultButton';
import Consts from 'utils/Consts';

import Logo from './Logo';

const EditTextHeader = ({
  textId,
  handleSaveClick,
  release,
  handleReleaseToggle,
  enableSave,
  state,
}) => {
  const [toggleReleaseValue, setToggleReleaseValue] = useState(release ? 'release' : 'draft');

  const ToggleButtonSxL = {
    ...Consts.SX.ToggleButton,
    borderWidth: '2px 0px 2px 2px',
  };
  const ToggleButtonSxR = {
    ...Consts.SX.ToggleButton,
    borderWidth: '2px 2px 2px 0px',
  };

  let saveButtonContent;

  if (state === 'saving') {
    saveButtonContent = <CircularProgress size={28} sx={{ color: 'white' }} />;
  } else if (state === 'saved' && !enableSave) {
    saveButtonContent = <CheckIcon sx={{ color: 'black' }} />;
  } else {
    saveButtonContent = <>保存</>;
  }

  return (
    <>
      <Box
        sx={{
          pt: { xs: 0, sm: 1 },
          pb: { xs: 0, sm: 1 },
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          height: '54px',
          whiteSpace: 'nowrap',
          px: { xs: 0.4, sm: 2 },
          my: { xs: 0.4, sm: 1 },
        }}
      >
        <Logo />

        <Box
          sx={{
            display: 'flex',
            marginLeft: 'auto',
            alignItems: 'center',
          }}
        >
          <ToggleButtonGroup sx={{ fontWeight: 'bold' }} exclusive value={toggleReleaseValue}>
            <ToggleButton
              value='draft'
              sx={ToggleButtonSxL}
              onClick={() => {
                setToggleReleaseValue('draft');
                handleReleaseToggle(false);
              }}
            >
              下書き
            </ToggleButton>
            <ToggleButton
              value='release'
              sx={ToggleButtonSxR}
              onClick={() => {
                setToggleReleaseValue('release');
                handleReleaseToggle(true);
              }}
            >
              公開
            </ToggleButton>
          </ToggleButtonGroup>
          <Box
            variant='contained'
            onClick={() => {
              router.push(`/texts/${textId}`);
            }}
            sx={{
              pr: 2,
              pl: 2,
              ml: 1,
              height: 40,
              display: 'flex',
              cursor: 'pointer',
              alignItems: 'center',
              justifyContent: 'center',
              color: Consts.COLOR.Primary,
              backgroundColor: 'white',
              whiteSpace: 'nowrap',
              fontWeight: 'bold',
              border: '2px solid ' + Consts.COLOR.Primary,
              '&:hover': {
                backgroundColor: Consts.COLOR.LightPrimary,
              },
            }}
          >
            プレビュー
          </Box>
          <DefaultButton
            exSx={{ ml: 1 }}
            disabled={!enableSave}
            onClick={() => {
              if (state !== 'saving') handleSaveClick();
            }}
          >
            {saveButtonContent}
          </DefaultButton>
        </Box>
      </Box>
    </>
  );
};

export default EditTextHeader;

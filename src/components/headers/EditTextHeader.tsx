import { release } from 'os';

import { Box, ToggleButton, ToggleButtonGroup, useMediaQuery } from '@mui/material';
import router from 'next/router';
import { useState } from 'react';

import DefaultButton from 'components/DefaultButton';
import Consts from 'utils/Consts';

import Logo from './Logo';
import PreviewButton from './PreviewButton';
import ReleaseToggle from './ReleaseToggle';
import SLogo from './SLogo';

const EditTextHeader = ({
  state,
  hasChapter,
  textId,
  release,
  handleReleaseToggle,
  handleApplicationClick,
  handleApplicationCancelClick,
}) => {
  const mq = useMediaQuery('(min-width:600px)');

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
        {mq ? <Logo /> : <SLogo />}

        <Box
          sx={{
            display: 'flex',
            marginLeft: 'auto',
            alignItems: 'center',
          }}
        >
          {(state == Consts.TEXTSTATE.Selling || state == Consts.TEXTSTATE.SellingWithReader) && (
            <ReleaseToggle release={release} handleReleaseToggle={handleReleaseToggle} />
          )}
          <PreviewButton
            onClick={() => {
              router.push(`/texts/${textId}`);
            }}
          />
          {(state == Consts.TEXTSTATE.Draft ||
            state == Consts.TEXTSTATE.DraftRejected ||
            state == Consts.TEXTSTATE.DraftBanned) &&
            hasChapter && (
              <DefaultButton sx={{ ml: 1 }} onClick={handleApplicationClick}>
                販売審査に提出
              </DefaultButton>
            )}
          {state == Consts.TEXTSTATE.UnderReview && (
            <DefaultButton sx={{ ml: 1 }} onClick={handleApplicationCancelClick}>
              販売審査を取り消し
            </DefaultButton>
          )}
        </Box>
      </Box>
    </>
  );
};

export default EditTextHeader;

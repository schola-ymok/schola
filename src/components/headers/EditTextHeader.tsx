import { Box, Button, ToggleButton, ToggleButtonGroup, useMediaQuery } from '@mui/material';
import Link from 'next/link';
import router from 'next/router';
import { useContext, useState } from 'react';

import { AppContext } from 'states/store';
import Consts from 'utils/Consts';

const EditTextHeader = ({ handleSaveClick, release, handleReleaseToggle }) => {
  const { state, dispatch } = useContext(AppContext);
  const [toggleReleaseValue, setToggleReleaseValue] = useState(release ? 'release' : 'draft');
  const [enableSave, setEnableSave] = useState(true);

  const mq = useMediaQuery('(min-width:600px)');
  const back = mq ? <>&lt; 執筆テキスト一覧</> : <>&lt;</>;

  const ToggleButtonSxL = {
    ...Consts.SX.ToggleButton,
    borderWidth: '2px 0px 2px 2px',
  };
  const ToggleButtonSxR = {
    ...Consts.SX.ToggleButton,
    borderWidth: '2px 2px 2px 0px',
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          whiteSpace: 'nowrap',
          px: { xs: 0.4, sm: 2 },
          my: { xs: 0.4, sm: 1 },
        }}
      >
        <Link href='#'>
          <a
            onClick={() => router.push('/dashboard')}
            style={{ display: 'block', fontSize: '1.0em', fontWeight: 'bold' }}
          >
            <Box
              sx={{ display: 'block', fontSize: '1.0em', fontWeight: 'bold', ml: { xs: 1, sm: 0 } }}
            >
              {back}
            </Box>
          </a>
        </Link>

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
          <Button
            variant='contained'
            disabled={!enableSave}
            onClick={handleSaveClick}
            sx={{
              pr: 2,
              pl: 2,
              ml: 1,
              height: 40,
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
          </Button>
          <Button
            variant='contained'
            disabled={!enableSave}
            onClick={handleSaveClick}
            sx={{
              ml: 1,
              pr: 3,
              pl: 3,
              height: 40,
              whiteSpace: 'nowrap',
              fontWeight: 'bold',
            }}
          >
            保存
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default EditTextHeader;

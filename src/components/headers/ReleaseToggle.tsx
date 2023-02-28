import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useState } from 'react';

import Consts from 'utils/Consts';

const ReleaseToggle = ({ release, handleReleaseToggle, disabled }) => {
  const [toggleReleaseValue, setToggleReleaseValue] = useState(release ? 'release' : 'draft');

  const selectedColor = !disabled ? Consts.COLOR.Primary : '#aaaaaa';
  const selectedBGColor = !disabled ? Consts.COLOR.LightPrimary : '#dddddd';

  const ToggleButtonSx = {
    fontSize: '0.8em',
    fontWeight: 'bold',
    border: '2px solid ' + Consts.COLOR.Primary,
    height: '40px',
    p: 0.9,
    '&.Mui-selected': {
      color: selectedColor,
      backgroundColor: selectedBGColor,
    },
    '&.Mui-selected:hover': {
      cursor: 'default',
    },
    '&:hover': {
      backgroundColor: Consts.COLOR.LightPrimarySelected,
    },
    '&.Mui-disabled': {
      border: '2px solid ' + Consts.COLOR.Grey,
    },
  };

  const ToggleButtonSxL = {
    ...ToggleButtonSx,
    borderWidth: '2px 0px 2px 2px',
    borderRadius: '5px',
    '&.Mui-disabled': {
      border: '2px solid ' + Consts.COLOR.Grey,
      borderWidth: '2px 0px 2px 2px',
    },
  };
  const ToggleButtonSxR = {
    ...ToggleButtonSx,
    borderWidth: '2px 2px 2px 0px',
    borderRadius: '5px',
    '&.Mui-disabled': {
      border: '2px solid ' + Consts.COLOR.Grey,
      borderWidth: '2px 2px 2px 0px',
    },
  };

  return (
    <ToggleButtonGroup sx={{ fontWeight: 'bold' }} exclusive value={toggleReleaseValue}>
      <ToggleButton
        disabled={disabled}
        value='draft'
        sx={{ ...ToggleButtonSxL }}
        onClick={() => {
          setToggleReleaseValue('draft');
          handleReleaseToggle(false);
        }}
      >
        非公開
      </ToggleButton>
      <ToggleButton
        disabled={disabled}
        value='release'
        sx={{ ...ToggleButtonSxR }}
        onClick={() => {
          setToggleReleaseValue('release');
          handleReleaseToggle(true);
        }}
      >
        公開
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ReleaseToggle;

import { Box } from '@mui/material';

import Consts from 'utils/Consts';

const TrialReadingAvailableLabel = ({ sx }) => {
  return (
    <Box
      sx={{
        backgroundColor: Consts.COLOR.LightPrimary,
        color: Consts.COLOR.Primary,
        fontSize: '0.7em',
        fontWeight: 'normal',
        borderRadius: '5px',
        px: 0.5,
        whiteSpace: 'nowrap',
        my: 'auto',
        ...sx,
      }}
    >
      無料公開
    </Box>
  );
};

export default TrialReadingAvailableLabel;

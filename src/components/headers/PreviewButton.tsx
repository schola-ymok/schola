import { Box } from '@mui/material';

import Consts from 'utils/Consts';

const PreviewButton = ({ onClick, disabled }) => {
  const exSx = disabled
    ? {
        color: '#aaaaaa',
        border: '2px solid #aaaaaa',
      }
    : {
        color: Consts.COLOR.Primary,
        cursor: 'pointer',
        color: Consts.COLOR.Primary,
        backgroundColor: 'white',
        border: '2px solid ' + Consts.COLOR.Primary,
        '&:hover': {
          backgroundColor: Consts.COLOR.LightPrimary,
        },
      };

  return (
    <Box
      variant='contained'
      onClick={onClick}
      sx={{
        pr: 2,
        pl: 2,
        ml: 1,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
        fontWeight: 'bold',
        ...exSx,
      }}
    >
      プレビュー
    </Box>
  );
};

export default PreviewButton;

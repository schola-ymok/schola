import InfoIcon from '@mui/icons-material/Info';
import { Box } from '@mui/material';

import Consts from 'utils/Consts';

const NoteBlock = ({ inline, className, children }) => {
  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: Consts.COLOR.LightPrimary,
        borderRadius: '5px',
        display: 'flex',
      }}
    >
      <InfoIcon sx={{ my: 'auto', color: '#99bbbb', mr: 1 }} />
      {children}
    </Box>
  );
};

export default NoteBlock;

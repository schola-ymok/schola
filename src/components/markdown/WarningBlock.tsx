import InfoIcon from '@mui/icons-material/Info';
import { Box } from '@mui/material';


const WarningBlock = ({ children }) => {
  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: '#ffdddd',
        borderRadius: '5px',
        display: 'flex',
      }}
    >
      <InfoIcon sx={{ my: 'auto', color: '#ddaaaa', mr: 1 }} />
      {children}
    </Box>
  );
};

export default WarningBlock;

import { Box } from '@mui/material';

const FormItemSubLabel = ({ children, sx }) => (
  <Box
    sx={{
      fontSize: '0.8em',
      color: '#777777',
      ...sx,
    }}
  >
    {children}
  </Box>
);

export default FormItemSubLabel;

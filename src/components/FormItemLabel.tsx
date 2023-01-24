import { Box } from '@mui/material';

const FormItemLabel = ({ children, sx }) => (
  <Box
    sx={{
      fontWeight: 'bold',
      ...sx,
    }}
  >
    <span style={{ verticalAlign: 'top', my: 'auto' }}>{children}</span>
  </Box>
);

export default FormItemLabel;

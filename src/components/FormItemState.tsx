import { Box } from '@mui/material';

import Consts from 'utils/Consts';

const FormItemState = ({ validation, sx }) => {
  const color = validation?.ok ? Consts.COLOR.Primary : '#cc0000';

  return (
    <Box
      sx={{
        fontSize: '0.8em',
        color: color,
        ...sx,
      }}
    >
      {validation ? validation.message : <>&nbsp;</>}
    </Box>
  );
};

export default FormItemState;

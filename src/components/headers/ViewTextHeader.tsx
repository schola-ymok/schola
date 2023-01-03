import {
    Box
} from '@mui/material';


const ViewTextHeader = ({ title }) => {
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
        <Box sx={{ fontSize: '1.7em', fontWeight: 'bold' }}>{title}</Box>
      </Box>
    </>
  );
};

export default ViewTextHeader;

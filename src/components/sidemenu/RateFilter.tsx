import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Rating,
  Box,
} from '@mui/material';
import router from 'next/router';

const RateFilter = ({ onChange }) => {
  const initRateFilter = router.query.rate == undefined ? 0 : router.query.rate;

  return (
    <FormControl sx={{ mb: 1 }}>
      <Box sx={{ fontSize: '0.9em', color: '#777777' }}>評価</Box>
      <RadioGroup
        aria-labelledby='rate-filter'
        name='rate-filter'
        value={initRateFilter}
        onChange={(e) => onChange({ rate: e.target.value })}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControlLabel
            value='5'
            control={<Radio size='small' />}
            sx={{ p: 0, m: 0 }}
            label={
              <Box sx={{ fontSize: '0.8em' }}>
                <Rating name='read-only' value={5} readOnly size='small' />
                &nbsp;以上
              </Box>
            }
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControlLabel
            value='4'
            control={<Radio size='small' />}
            sx={{ p: 0, m: 0 }}
            label={
              <Box sx={{ fontSize: '0.8em' }}>
                <Rating name='read-only' value={4} readOnly size='small' />
                &nbsp;以上
              </Box>
            }
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControlLabel
            value='3'
            control={<Radio size='small' />}
            sx={{ p: 0, m: 0 }}
            label={
              <Box sx={{ fontSize: '0.8em' }}>
                <Rating name='read-only' value={3} readOnly size='small' />
                &nbsp;以上
              </Box>
            }
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControlLabel
            value='2'
            control={<Radio size='small' />}
            sx={{ p: 0, m: 0 }}
            label={
              <Box sx={{ fontSize: '0.8em', display: 'flex' }}>
                <Rating sx={{ my: 'auto' }} name='read-only' value={2} readOnly size='small' />
                &nbsp;以上
              </Box>
            }
          />
        </Box>
        {initRateFilter > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              value='0'
              control={<Radio size='small' />}
              sx={{ p: 0, m: 0 }}
              label={<Box sx={{ fontSize: '0.8em' }}>条件解除</Box>}
            />
          </Box>
        )}
      </RadioGroup>
    </FormControl>
  );
};

export default RateFilter;

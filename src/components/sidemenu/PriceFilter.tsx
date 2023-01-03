import { Checkbox, FormControlLabel, FormControl, FormLabel, Box, Rating } from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';

const PriceFilter = ({ onChange }) => {
  const router = useRouter();

  let initPriceFilter = {};

  initPriceFilter['1'] = router.query.pf_1 ? true : false;
  initPriceFilter['2'] = router.query.pf_2 ? true : false;
  initPriceFilter['3'] = router.query.pf_3 ? true : false;
  initPriceFilter['4'] = router.query.pf_4 ? true : false;
  initPriceFilter['5'] = router.query.pf_5 ? true : false;

  const [priceFilter, setPriceFilter] = useState(initPriceFilter);

  const ref = useRef(true);

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      return;
    }

    let params = [1, 2, 3, 4, 5].reduce((acc, cur) => {
      if (cur in priceFilter) {
        const key = 'pf_' + cur;
        if (priceFilter[cur] == true) return { ...acc, [key]: 1 };
      }
      return acc;
    }, {});

    onChange(params);
  }, [priceFilter]);

  const handlePriceFilterChanged = (e) => {
    setPriceFilter({ ...priceFilter, [e.target.value]: e.target.checked });
  };

  return (
    <FormControl>
      <Box sx={{ fontSize: '0.9em', color: '#777777' }}>価格</Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
          value='1'
          checked={priceFilter['1']}
          control={
            <Checkbox
              sx={{ px: '5px', py: '5px' }}
              size='small'
              onChange={handlePriceFilterChanged}
            />
          }
          sx={{ p: 0, m: 0 }}
          label={<Box sx={{ fontSize: '0.8em' }}>100-200円</Box>}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
          value='2'
          checked={priceFilter['2']}
          control={
            <Checkbox
              sx={{ px: '5px', py: '5px' }}
              size='small'
              onChange={handlePriceFilterChanged}
            />
          }
          sx={{ p: 0, m: 0 }}
          label={<Box sx={{ fontSize: '0.8em' }}>200-300円</Box>}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
          value='3'
          checked={priceFilter['3']}
          control={
            <Checkbox
              sx={{ px: '5px', py: '5px' }}
              size='small'
              onChange={handlePriceFilterChanged}
            />
          }
          sx={{ p: 0, m: 0 }}
          label={<Box sx={{ fontSize: '0.8em' }}>300-400円</Box>}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
          value='4'
          checked={priceFilter['4']}
          control={
            <Checkbox
              sx={{ px: '5px', py: '5px' }}
              size='small'
              onChange={handlePriceFilterChanged}
            />
          }
          sx={{ p: 0, m: 0 }}
          label={<Box sx={{ fontSize: '0.8em' }}>400-500円</Box>}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
          value='5'
          checked={priceFilter['5']}
          control={
            <Checkbox
              sx={{ px: '5px', py: '5px' }}
              size='small'
              onChange={handlePriceFilterChanged}
            />
          }
          sx={{ p: 0, m: 0 }}
          label={<Box sx={{ fontSize: '0.8em' }}>500-1,000円</Box>}
        />
      </Box>
    </FormControl>
  );
};

export default PriceFilter;

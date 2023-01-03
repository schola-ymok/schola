import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Box } from '@mui/material';
import router, { useRouter } from 'next/router';

import Consts from 'utils/Consts';

const SortType = ({ setSortType }) => {
  const router = useRouter();
  const sortTypeValue = router.query.sort == '' ? '' : router.query.sort;

  return (
    <FormControl sx={{ mb: 1 }}>
      <Box sx={{ fontSize: '0.9em', color: '#777777' }}>並べ替え</Box>
      <RadioGroup
        row
        aria-labelledby='sort-type'
        name='sort-type'
        value={sortTypeValue}
        onChange={(e) => setSortType({ sort: e.target.value })}
      >
        <FormControlLabel
          value='sales'
          control={<Radio size='small' />}
          sx={{ p: 0, m: 0 }}
          label={<Box sx={{ fontSize: '0.8em' }}>売上数順</Box>}
        />
        <FormControlLabel
          value='new'
          control={<Radio size='small' />}
          sx={{ p: 0, m: 0 }}
          label={<Box sx={{ fontSize: '0.8em' }}>更新日が新しい順</Box>}
        />
        <FormControlLabel
          value='old'
          control={<Radio size='small' />}
          sx={{ p: 0, m: 0 }}
          label={<Box sx={{ fontSize: '0.8em' }}>更新日が古い順</Box>}
        />
        <FormControlLabel
          value='rate'
          control={<Radio size='small' />}
          sx={{ p: 0, m: 0 }}
          label={<Box sx={{ fontSize: '0.8em' }}>レビューの評価順</Box>}
        />
        <FormControlLabel
          value='price_high'
          control={<Radio size='small' />}
          sx={{ p: 0, m: 0 }}
          label={<Box sx={{ fontSize: '0.8em' }}>価格が高い順</Box>}
        />
        <FormControlLabel
          value='price_low'
          control={<Radio size='small' />}
          sx={{ p: 0, m: 0 }}
          label={<Box sx={{ fontSize: '0.8em' }}>価格が安い順</Box>}
        />
      </RadioGroup>
    </FormControl>
  );
};

export default SortType;

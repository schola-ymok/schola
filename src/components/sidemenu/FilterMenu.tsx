import { Box } from '@mui/material';

import PriceFilter from './PriceFilter';
import RateFilter from './RateFilter';
import SortType from './SortType';

const FilterMenu = ({ sortType, setSortType, setRateFilter, setPriceFilter }) => {
  return (
    <Box sx={{ whiteSpace: 'nowrap', display: { sm: 'block', xs: 'none' }, mr: 2 }}>
      <Box
        sx={{
          width: 200,
          pr: 1,
          pt: 2,
          borderRight: '1px solid #aaaaaa',
          display: 'flex',
          flexFlow: 'column',
        }}
      >
        <SortType sortType={sortType} setSortType={setSortType} />
        <RateFilter onChange={setRateFilter} />
        <PriceFilter onChange={setPriceFilter} />
      </Box>
    </Box>
  );
};

export default FilterMenu;

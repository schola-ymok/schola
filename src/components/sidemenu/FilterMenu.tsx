import { Box, useMediaQuery } from '@mui/material';

import MenuCloseButton from './MenuCloseButton';
import PriceFilter from './PriceFilter';
import RateFilter from './RateFilter';
import SortType from './SortType';

const FilterMenu = ({ sortType, setSortType, setRateFilter, setPriceFilter, onClose }) => {
  const mq = useMediaQuery('(min-width:600px)');

  const TList = () => (
    <>
      <SortType sortType={sortType} setSortType={setSortType} />
      <RateFilter onChange={setRateFilter} />
      <PriceFilter onChange={setPriceFilter} />
    </>
  );

  const DesktopContent = () => (
    <Box sx={{ whiteSpace: 'nowrap', mr: 2 }}>
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
        <TList />
      </Box>
    </Box>
  );

  const MobileContent = () => (
    <Box sx={{ whiteSpace: 'nowrap', p: 1 }}>
      <MenuCloseButton onClick={onClose} />
      <Box sx={{ width: 200, pl: 1, pt: 1, display: 'flex', flexFlow: 'column' }}>
        <TList />
      </Box>
    </Box>
  );

  return <>{mq ? <DesktopContent /> : <MobileContent />}</>;
};

export default FilterMenu;

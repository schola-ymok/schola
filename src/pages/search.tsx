import { Box, Drawer, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import SearchTextList from 'components/SearchTextList';
import HeaderWithMenuButton from 'components/headers/HeaderWithMenuButton';
import FilterMenu from 'components/sidemenu/FilterMenu';

import type { NextPage } from 'next';

const Search: NextPage = () => {
  const router = useRouter();
  const mq = useMediaQuery('(min-width:600px)');

  const [priceFilter, setPriceFilter] = useState();
  const [sortType, setSortType] = useState();
  const [rateFilter, setRateFilter] = useState();

  const [menuOpen, setMenuOpen] = useState(false);

  const keyword = router.query.keyword;
  const ref = useRef(true);

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      return;
    }

    const newQuery = {
      keyword: keyword,
      ...sortType,
      ...rateFilter,
      ...priceFilter,
    };

    const queryString = new URLSearchParams({ ...newQuery }).toString();

    router.push('/search?' + queryString, undefined, {
      scroll: false,
    });
  }, [priceFilter, sortType, rateFilter]);

  return (
    <>
      <HeaderWithMenuButton
        onClick={() => {
          setMenuOpen(true);
        }}
      />

      <Box sx={{ display: 'flex', p: { xs: 0.4, sm: 2 } }}>
        {mq ? (
          <FilterMenu
            setSortType={setSortType}
            setRateFilter={setRateFilter}
            setPriceFilter={setPriceFilter}
          />
        ) : (
          <Drawer
            anchor={'left'}
            open={menuOpen}
            onClose={() => {
              setMenuOpen(false);
            }}
          >
            <FilterMenu
              setSortType={setSortType}
              setRateFilter={setRateFilter}
              setPriceFilter={setPriceFilter}
              onClose={() => {
                setMenuOpen(false);
              }}
            />
          </Drawer>
        )}
        <Box sx={{ display: 'flex', flexFlow: 'column' }}>
          <Box sx={{ fontSize: '1.2em', fontWeight: 'bold' }}>"{keyword}"の検索結果</Box>
          <Box>
            <SearchTextList />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Search;

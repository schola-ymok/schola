import {
  Card,
  Box,
  Button,
  Checkbox,
  Snackbar,
  CardContent,
  Link,
  Grid,
  Typography,
  Pagination,
} from '@mui/material';
import { ref } from 'firebase/storage';
import router, { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';

import { getTextList } from 'api/getTextList';
import SearchTextList from 'components/SearchTextList';
import TextCard from 'components/TextCard';
import Layout from 'components/layouts/Layout';
import FilterMenu from 'components/sidemenu/FilterMenu';
import PriceFilter from 'components/sidemenu/PriceFilter';
import RateFilter from 'components/sidemenu/RateFilter';
import SortType from 'components/sidemenu/SortType';
import Consts from 'utils/Consts';
import { pagenation } from 'utils/pagenation';

import type { NextPage } from 'next';

const Search: NextPage = () => {
  const router = useRouter();

  const [priceFilter, setPriceFilter] = useState();
  const [sortType, setSortType] = useState();
  const [rateFilter, setRateFilter] = useState();

  const keyword = router.query.keyword;
  const ref = useRef(true);

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      return;
    }

    console.log(priceFilter);
    const currentQuery = router.query;
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
    <Box sx={{ display: 'flex' }}>
      <FilterMenu
        setSortType={setSortType}
        setRateFilter={setRateFilter}
        setPriceFilter={setPriceFilter}
      />
      <Box sx={{ display: 'flex', flexFlow: 'column' }}>
        <Box sx={{ fontSize: '1.2em', fontWeight: 'bold' }}>"{keyword}"の検索結果</Box>
        <Box>
          <SearchTextList />
        </Box>
      </Box>
    </Box>
  );
};

Search.getLayout = (page) => <Layout>{page}</Layout>;
export default Search;

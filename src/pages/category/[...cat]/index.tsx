import {
  Card,
  Button,
  Checkbox,
  Snackbar,
  CardContent,
  Grid,
  Typography,
  Box,
} from '@mui/material';
import { NextPage } from 'next';
import Link from 'next/link';
import router, { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import useSWR from 'swr';

import { getTextList } from 'api/getTextList';
import HomeTextList from 'components/HomeTextList';
import TextCard from 'components/TextCard';
import TextList from 'components/TextList';
import Layout from 'components/layouts/Layout';
import FilterMenu from 'components/sidemenu/FilterMenu';
import PriceFilter from 'components/sidemenu/PriceFilter';
import RateFilter from 'components/sidemenu/RateFilter';
import SortType from 'components/sidemenu/SortType';
import SubCategory from 'components/sidemenu/SubCategory';
import Consts from 'utils/Consts';

const Home: NextPage = () => {
  const router = useRouter();

  const rootCategory = router.query.cat[0];
  const category = router.query.cat[1];

  const [priceFilter, setPriceFilter] = useState();
  const [sortType, setSortType] = useState();
  const [rateFilter, setRateFilter] = useState();

  const ref = useRef(true);

  const categoryPath = () => {
    return rootCategory + (category != undefined ? `/${category}` : '');
  };

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      return;
    }

    if (router.query.list != undefined) {
      const query = new URLSearchParams({
        ...sortType,
        ...rateFilter,
        ...priceFilter,
      }).toString();

      router.push(categoryPath() + `?list=1&${query}`, undefined, {
        scroll: false,
      });
    }
  }, [priceFilter, sortType, rateFilter]);

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ display: 'flex', flexFlow: 'column' }}>
        <SubCategory rootCategory={rootCategory} category={category} />
        {router.query.list != undefined && (
          <FilterMenu
            setSortType={setSortType}
            setRateFilter={setRateFilter}
            setPriceFilter={setPriceFilter}
          />
        )}
      </Box>
      <Box>
        <Box sx={{ mb: 2 }}>
          <h4>
            {Consts.CATEGORY[rootCategory].label}
            {category &&
              Consts.CATEGORY[rootCategory].items.map((e) => {
                if (e.key == category) return ' / ' + e.label;
              })}
          </h4>
        </Box>
        {router.query.more != undefined ? (
          <TextList />
        ) : (
          <HomeTextList rootCategory={rootCategory} category={category} />
        )}
      </Box>
    </Box>
  );
};

Home.getLayout = (page) => <Layout>{page}</Layout>;
export default Home;

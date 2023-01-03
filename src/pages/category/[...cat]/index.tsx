import {
    Box
} from '@mui/material';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import HomeTextList from 'components/HomeTextList';
import Layout from 'components/layouts/Layout';
import FilterMenu from 'components/sidemenu/FilterMenu';
import SubCategory from 'components/sidemenu/SubCategory';
import TextList from 'components/TextList';
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

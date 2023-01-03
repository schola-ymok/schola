import { Box } from '@mui/material';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import HomeTextList from 'components/HomeTextList';
import TextList from 'components/TextList';
import Layout from 'components/layouts/Layout';
import FilterMenu from 'components/sidemenu/FilterMenu';
import SubCategory from 'components/sidemenu/SubCategory';
import Consts from 'utils/Consts';

const Home: NextPage = () => {
  const router = useRouter();

  const rootCategory = router.query.cat[0];
  const category = router.query.cat[1];

  const ref = useRef(true);

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      return;
    }
  }, []);

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Box sx={{ display: 'flex', flexFlow: 'column' }}>
        <SubCategory rootCategory={rootCategory} category={category} />
      </Box>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ mb: 2, width: '100%' }}>
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

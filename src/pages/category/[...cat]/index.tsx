import { Box, Drawer, useMediaQuery } from '@mui/material';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import Footer from 'components/Footer';
import HomeTextList from 'components/HomeTextList';
import TextList from 'components/TextList';
import HeaderWithMenuButton from 'components/headers/HeaderWithMenuButton';
import FilterMenu from 'components/sidemenu/FilterMenu';
import SubCategory from 'components/sidemenu/SubCategory';
import Consts from 'utils/Consts';

const Home: NextPage = () => {
  const router = useRouter();

  const rootCategory = router.query.cat[0];
  const category = router.query.cat[1];
  const mq = useMediaQuery('(min-width:600px)');

  const [menuOpen, setMenuOpen] = useState(false);

  const ref = useRef(true);

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      return;
    }
  }, []);

  return (
    <>
      <HeaderWithMenuButton
        onClick={() => {
          setMenuOpen(true);
        }}
      />
      <Box sx={{ display: 'flex', p: { xs: 0.4, sm: 2 } }}>
        {mq ? (
          <Box sx={{ display: 'flex', flexFlow: 'column' }}>
            <SubCategory rootCategory={rootCategory} category={category} />
          </Box>
        ) : (
          <Drawer
            anchor={'left'}
            open={menuOpen}
            onClose={() => {
              setMenuOpen(false);
            }}
          >
            <SubCategory
              rootCategory={rootCategory}
              category={category}
              onClose={() => {
                setMenuOpen(false);
              }}
            />
          </Drawer>
        )}
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
      <Footer />
    </>
  );
};

export default Home;

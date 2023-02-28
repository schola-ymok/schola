import { Box, Drawer, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';

import Footer from 'components/Footer';
import HeaderWithMenuButton from 'components/headers/HeaderWithMenuButton';
import HomeTextList from 'components/HomeTextList';
import RootCategory from 'components/sidemenu/RootCategory';
import TextList from 'components/TextList';

import type { NextPage } from 'next';

const Home: NextPage = () => {
  const router = useRouter();
  const more = router.query.more !== undefined;

  const [menuOpen, setMenuOpen] = useState(false);

  const mq = useMediaQuery('(min-width:600px)');

  return (
    <>
      <HeaderWithMenuButton
        onClick={() => {
          setMenuOpen(true);
        }}
      />
      <Box sx={{ display: 'flex', p: { xs: 0.4, sm: 2 } }}>
        {mq ? (
          <RootCategory />
        ) : (
          <Drawer
            anchor={'left'}
            open={menuOpen}
            onClose={() => {
              setMenuOpen(false);
            }}
          >
            <RootCategory
              onClose={() => {
                setMenuOpen(false);
              }}
            />
          </Drawer>
        )}
        {!more ? <HomeTextList /> : <TextList />}
      </Box>
      <Footer />
    </>
  );
};

export default Home;

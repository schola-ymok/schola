import { Box, Drawer } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';

import Footer from 'components/Footer';
import HomeTextList from 'components/HomeTextList';
import TextList from 'components/TextList';
import HeaderWithMenuButton from 'components/headers/HeaderWithMenuButton';
import RootCategory from 'components/sidemenu/RootCategory';

import type { NextPage } from 'next';

const Home: NextPage = () => {
  const router = useRouter();
  const more = router.query.more !== undefined;

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <HeaderWithMenuButton
        onClick={() => {
          setMenuOpen(true);
        }}
      />
      <Drawer
        anchor={'left'}
        open={menuOpen}
        onClose={() => {
          setMenuOpen(false);
        }}
      >
        <RootCategory />
      </Drawer>
      <Box sx={{ display: 'flex', p: { xs: 0.4, sm: 2 } }}>
        {!more ? <HomeTextList /> : <TextList />}
      </Box>
      <Footer />
    </>
  );
};

export default Home;

import { Box, Tab, Tabs } from '@mui/material';
import { Container } from '@mui/system';
import { useRouter } from 'next/router';
import { useState } from 'react';

import AdminApplcationList from 'components/admin/AdminApplicationList';
import AdminBanText from 'components/admin/AdminBanText';
import AdminBanUser from 'components/admin/AdminBanUser';
import AdminHeader from 'components/headers/AdminHeader';

import type { NextPage } from 'next';

const Home: NextPage = () => {
  const router = useRouter();

  const [tab, setTab] = useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  function TabPanel({ children, value, index }) {
    return (
      <div
        role='tabpanel'
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
      >
        {value === index && (
          <Box sx={{ py: 2, px: { xs: 0, sm: 1 }, mt: { xs: 1, sm: 2 } }}>{children}</Box>
        )}
      </div>
    );
  }

  return (
    <>
      <AdminHeader />
      <Container maxWidth='md'>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tab}
            onChange={handleChange}
            variant='scrollable'
            TabIndicatorProps={{ sx: { top: 'unset' } }}
          >
            <Tab label={<Box sx={{ fontWeight: 'bold' }}>テキスト査読</Box>} />
            <Tab label={<Box sx={{ fontWeight: 'bold' }}>テキスト公開停止</Box>} />
            <Tab label={<Box sx={{ fontWeight: 'bold' }}>アカウント凍結</Box>} />
          </Tabs>
        </Box>
        <TabPanel value={tab} index={0}>
          <AdminApplcationList />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <AdminBanText />
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <AdminBanUser />
        </TabPanel>
      </Container>
    </>
  );
};

export default Home;

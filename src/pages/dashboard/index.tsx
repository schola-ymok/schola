import { Tabs, Tab, Box } from '@mui/material';
import { Container } from '@mui/system';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';

import { AuthContext } from 'components/auth/AuthContext';
import DashboardPerformance from 'components/dashboard/DashboardPerformance';
import DashboardRevenue from 'components/dashboard/DashboardRevenue';
import DashboardReviews from 'components/dashboard/DashboardReviews';
import DashboardTextList from 'components/dashboard/DashboardTextList';
import Layout from 'components/layouts/Layout';

const Dashboard = () => {
  const router = useRouter();

  const { authAxios } = useContext(AuthContext);

  let _tab = 0;
  if (router.query.rev !== undefined) _tab = 1;
  if (router.query.pfm !== undefined) _tab = 2;
  if (router.query.rvn !== undefined) _tab = 3;
  const [tab, setTab] = useState(_tab);

  const handleTabChange = (event, newNumber) => {
    if (newNumber == 1) {
      router.replace('dashboard?rev');
    } else if (newNumber == 2) {
      router.replace('dashboard?pfm');
    } else if (newNumber == 3) {
      router.replace('dashboard?rvn');
    } else {
      router.replace('dashboard');
    }
    setTab(newNumber);
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
    <Container maxWidth='md'>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          TabIndicatorProps={{ sx: { top: 'unset' } }}
          value={tab}
          onChange={handleTabChange}
          scrollButtons
          allowScrollButtonsMobile
          variant='scrollable'
        >
          <Tab label={<Box sx={{ fontWeight: 'bold' }}>テキスト一覧</Box>} />
          <Tab label={<Box sx={{ fontWeight: 'bold' }}>レビュー</Box>} />
          <Tab label={<Box sx={{ fontWeight: 'bold' }}>パフォーマンス</Box>} />
          <Tab label={<Box sx={{ fontWeight: 'bold' }}>収益管理</Box>} />
        </Tabs>
      </Box>
      <TabPanel value={tab} index={0}>
        <DashboardTextList />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <DashboardReviews />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <DashboardPerformance />
      </TabPanel>
      <TabPanel value={tab} index={3}>
        <DashboardRevenue />
      </TabPanel>
    </Container>
  );
};

Dashboard.getLayout = (page) => <Layout>{page}</Layout>;
export default Dashboard;

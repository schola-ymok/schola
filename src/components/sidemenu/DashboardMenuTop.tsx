import { Tab, Tabs } from '@mui/material';

const DashboardMenuTop = ({ value, onChange }) => {
  return (
    <Tabs value={value} onChange={onChange} variant='scrollable' scrollButtons='auto'>
      <Tab id='text' label='テキスト' />
      <Tab id='review' label='レビュー' />
      <Tab id='performance' label='パフォーマンス' />
      <Tab id='revenue' label='収益管理' />
    </Tabs>
  );
};

export default DashboardMenuTop;

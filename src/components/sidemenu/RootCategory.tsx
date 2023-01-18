import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, useMediaQuery } from '@mui/material';
import Link from 'next/link';

import Consts from 'utils/Consts';

import MenuCloseButton from './MenuCloseButton';

const RootCategory = ({ onClose }) => {
  const keys = Object.keys(Consts.CATEGORY);
  const mq = useMediaQuery('(min-width:600px)');

  const CList = () => {
    const className = mq ? 'category' : 'category_mobile';
    return (
      <ul>
        {keys.map((item) => {
          return (
            <li className={className}>
              <Link href={'/category/' + item + '/'}>
                <a>{Consts.CATEGORY[item].label}</a>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  };

  const DesktopContent = () => (
    <Box sx={{ whiteSpace: 'nowrap', mr: 2 }}>
      <Box sx={{ width: 200, pr: 1, pt: 2, borderRight: '1px solid #aaaaaa' }}>
        <CList />
      </Box>
    </Box>
  );

  const MobileContent = () => (
    <Box sx={{ whiteSpace: 'nowrap', p: 1 }}>
      <MenuCloseButton onClick={onClose} />
      <Box sx={{ width: 200, pl: 1 }}>
        <CList />
      </Box>
    </Box>
  );

  return <>{mq ? <DesktopContent /> : <MobileContent />}</>;
};

export default RootCategory;

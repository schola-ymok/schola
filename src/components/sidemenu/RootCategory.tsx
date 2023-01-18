import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, useMediaQuery } from '@mui/material';
import Link from 'next/link';

import Consts from 'utils/Consts';

const RootCategory = ({ onClose }) => {
  const keys = Object.keys(Consts.CATEGORY);
  const mq = useMediaQuery('(min-width:600px)');

  const DesktopContent = ({ onClose }) => (
    <Box sx={{ whiteSpace: 'nowrap', mr: 2 }}>
      <Box sx={{ width: 200, pr: 1, pt: 2, borderRight: '1px solid #aaaaaa' }}>
        <ul>
          {keys.map((item) => {
            return (
              <li className='category'>
                <Link href={'/category/' + item + '/'}>
                  <a>{Consts.CATEGORY[item].label}</a>
                </Link>
              </li>
            );
          })}
        </ul>
      </Box>
    </Box>
  );

  const MobileContent = () => (
    <Box component='presentation' sx={{ whiteSpace: 'nowrap', p: 1 }}>
      <IconButton
        type='button'
        sx={{
          p: 1,
          '&:hover': Consts.SX.IconButtonHover,
        }}
        onClick={onClose}
      >
        <CloseIcon sx={{ transform: 'scale(1.2)' }} />
      </IconButton>
      <Box sx={{ width: 200, pl: 1 }}>
        <ul>
          {keys.map((item) => {
            return (
              <li className='category_mobile'>
                <Link href={'/category/' + item + '/'}>
                  <a>{Consts.CATEGORY[item].label}</a>
                </Link>
              </li>
            );
          })}
        </ul>
      </Box>
    </Box>
  );

  return <>{mq ? <DesktopContent /> : <MobileContent />}</>;
};

export default RootCategory;

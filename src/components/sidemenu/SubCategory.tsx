import { Box, useMediaQuery } from '@mui/material';
import Link from 'next/link';

import Consts from 'utils/Consts';

import MenuCloseButton from './MenuCloseButton';

const SubCategory = ({ rootCategory, category, onClose = () => {} }) => {
  const mq = useMediaQuery('(min-width:600px)');

  const CList = () => {
    const className = mq ? 'category' : 'category_mobile';
    const boxSx = mq ? { mb: 0.5, fontSize: '0.9em' } : { my: '0.5em', fontSize: '1.0em' };
    const boxSx2 = mq
      ? { ml: 1, mb: 0.7, fontWeight: 'bold', fontSize: '0.9em' }
      : { ml: 1, my: '0.5em', fontWeight: 'bold', fontSize: '1.0em' };

    return (
      <>
        <Box sx={boxSx}>
          &lt;{' '}
          <Link href='/'>
            <a>トップ</a>
          </Link>
        </Box>

        {category ? (
          <Box sx={boxSx}>
            &lt;{' '}
            <Link href={'/category/' + rootCategory}>
              <a onClick={onClose}>{Consts.CATEGORY[rootCategory].label}</a>
            </Link>
          </Box>
        ) : (
          <Box sx={boxSx2}>{Consts.CATEGORY[rootCategory].label}</Box>
        )}

        <Box sx={{ ml: 2 }}>
          <ul>
            {Consts.CATEGORY[rootCategory].items.map((item) => {
              return (
                <li className={className} key={item.key}>
                  {item.key == category ? (
                    <Box sx={{ fontWeight: 'bold' }}>{item.label}</Box>
                  ) : (
                    <Link href={rootCategory + '/' + item.key + '/'}>
                      <a onClick={onClose}>{item.label}</a>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </Box>
      </>
    );
  };

  const DesktopContent = () => (
    <Box sx={{ whiteSpace: 'nowrap', mr: 2 }}>
      <Box sx={{ width: 220, pr: 1, pt: 2, borderRight: { xs: 'none', sm: '1px solid #aaaaaa' } }}>
        <CList />
      </Box>
    </Box>
  );

  const MobileContent = () => (
    <Box sx={{ whiteSpace: 'nowrap', p: 1 }}>
      <MenuCloseButton onClick={onClose} />
      <Box sx={{ width: 220, pl: 1 }}>
        <CList />
      </Box>
    </Box>
  );

  return <>{mq ? <DesktopContent /> : <MobileContent />}</>;
};

export default SubCategory;

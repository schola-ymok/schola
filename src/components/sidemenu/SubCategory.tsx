import { Box, Stack, Typography } from '@mui/material';
import Link from 'next/link';

import Consts from 'utils/Consts';

const SubCategory = ({ rootCategory, category }) => {
  return (
    <Box sx={{ whiteSpace: 'nowrap', display: { sm: 'block', xs: 'none' }, mr: 2 }}>
      <Box sx={{ width: 200, pr: 1, pt: 2, borderRight: '1px solid #aaaaaa' }}>
        <Box sx={{ mb: 0.5, fontSize: '0.9em' }}>
          &lt;{' '}
          <Link href='/'>
            <a>トップ</a>
          </Link>
        </Box>

        {category ? (
          <Box sx={{ mb: 0.7, fontSize: '0.9em' }}>
            &lt;{' '}
            <Link href={'/category/' + rootCategory}>
              <a>{Consts.CATEGORY[rootCategory].label}</a>
            </Link>
          </Box>
        ) : (
          <Box sx={{ ml: 1, mb: 0.7, fontWeight: 'bold', fontSize: '0.9em' }}>
            {Consts.CATEGORY[rootCategory].label}
          </Box>
        )}

        <Box sx={{ ml: 2 }}>
          <ul>
            {Consts.CATEGORY[rootCategory].items.map((item) => {
              return (
                <li className='category' key={item.key}>
                  {item.key == category ? (
                    <Box sx={{ fontWeight: 'bold' }}>{item.label}</Box>
                  ) : (
                    <Link href={rootCategory + '/' + item.key + '/'}>
                      <a>{item.label}</a>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </Box>
      </Box>
    </Box>
  );
};

export default SubCategory;

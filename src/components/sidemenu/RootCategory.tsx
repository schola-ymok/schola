import { Box } from '@mui/material';
import Link from 'next/link';

import Consts from 'utils/Consts';

const RootCategory = () => {
  const keys = Object.keys(Consts.CATEGORY);

  return (
    <Box sx={{ whiteSpace: 'nowrap', display: { sm: 'block', xs: 'none' }, mr: 2 }}>
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
};

export default RootCategory;

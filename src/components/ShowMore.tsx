import path from 'path';

import { Box } from '@mui/material';
import Link from 'next/link';

import Consts from 'utils/Consts';

const ShowMore = ({ children, href }) => {
  return (
    <Link href={href}>
      <a style={{ textDecoration: 'none' }}>
        <Box
          component='span'
          sx={{
            fontWeight: 'bold',
            color: Consts.COLOR.Primary,
            cursor: 'pointer',
            fontSize: '0.9em',
            '&:hover': {
              color: Consts.COLOR.PrimaryDark,
              textDecoration: 'underline',
            },
          }}
        >
          {children}
        </Box>
      </a>
    </Link>
  );
};

export default ShowMore;

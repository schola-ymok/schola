import { Box } from '@mui/material';
import Link from 'next/link';

const Logo = ({ sx }) => {
  return (
    <Link href='/'>
      <a>
        <Box
          component='img'
          display='flex'
          sx={{
            my: 'auto',
            width: 100,
            py: 1.2,
            ...sx,
          }}
          src={'/logo-s.svg'}
        />
      </a>
    </Link>
  );
};

export default Logo;

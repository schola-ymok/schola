import { Box } from '@mui/material';
import Link from 'next/link';

const Logo = () => {
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
          }}
          src={'/logo-s.svg'}
        />
      </a>
    </Link>
  );
};

export default Logo;

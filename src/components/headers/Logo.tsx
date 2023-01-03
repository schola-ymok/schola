import { Box } from '@mui/material';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href='/'>
      <a>
        <Box>
          <img src='/logo.svg' width='110px' height='41px' />
        </Box>
      </a>
    </Link>
  );
};

export default Logo;

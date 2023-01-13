import { Box } from '@mui/material';
import Link from 'next/link';

const SLogo = () => {
  return (
    <Link href='/'>
      <a>
        <Box
          component='img'
          display='flex'
          sx={{
            my: 'auto',
            width: 32,
            ml: 0.5,
          }}
          src={'/logo-icon.svg'}
        />
      </a>
    </Link>
  );
};

export default SLogo;

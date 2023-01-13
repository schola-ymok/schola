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
            width: 28,
            py: 1.2,
          }}
          src={'/slogo.svg'}
        />
      </a>
    </Link>
  );
};

export default SLogo;

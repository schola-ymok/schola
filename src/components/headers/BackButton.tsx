import { Box } from '@mui/material';
import Link from 'next/link';
import router from 'next/router';

const BackButton = () => {
  return (
    <Link href='#'>
      <a onClick={() => router.back()}>
        <Box
          sx={{
            display: 'block',
            py: 0.3,
            fontSize: '1.1em',
            whiteSpace: 'nowrap',
            fontWeight: 'bold',
          }}
        >
          戻る
        </Box>
      </a>
    </Link>
  );
};

export default BackButton;

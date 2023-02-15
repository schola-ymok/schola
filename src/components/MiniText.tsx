import { Box, Link } from '@mui/material';
import { useRouter } from 'next/router';

import Consts from 'utils/Consts';

const MiniText = ({ text }) => {
  const router = useRouter();

  const imageUrl = text.photo_id
    ? Consts.IMAGE_STORE_URL + text.photo_id + '.png'
    : '/cover-default.svg';

  const handleAuthorClick = () => {
    router.push(`/users/${text.author_id}`);
  };

  return (
    <Box sx={{ display: 'flex', mt: 1 }}>
      <Link href={`/texts/${text.id}`} sx={{ textDecoration: 'none', display: 'flex' }}>
        <Box
          component='img'
          display='flex'
          sx={{
            my: 'auto',
            width: 100,
            height: 56,
            cursor: 'pointer',
          }}
          src={imageUrl}
        />
      </Link>
      <Box sx={{ display: 'flex', flexFlow: 'column', py: 0.4, ml: 1 }}>
        <Link href={`/texts/${text.id}`} sx={{ textDecoration: 'none' }}>
          <Box
            sx={{
              fontSize: '1.3em',
              fontWeight: 'bold',
              cursor: 'pointer',
              color: Consts.COLOR.Primary,
              textDecoration: 'none',
              '&:hover': {
                color: Consts.COLOR.PrimaryDark,
                textDecoration: 'underline',
              },
              wordBreak: 'break-all',
            }}
          >
            {text.title}
          </Box>
        </Link>
        <Link
          href={`/users/${text.author_id}`}
          sx={{ textDecoration: 'none', width: 'fit-content' }}
        >
          <Box
            sx={{
              width: 'fit-content',
              fontSize: '1.0em',
              cursor: 'pointer',
              color: Consts.COLOR.Primary,
              '&:hover': {
                color: Consts.COLOR.PrimaryDark,
                textDecoration: 'underline',
              },
            }}
            onClick={handleAuthorClick}
          >
            {text.author_display_name}
          </Box>
        </Link>
      </Box>
    </Box>
  );
};

export default MiniText;

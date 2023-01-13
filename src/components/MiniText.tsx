import { Box } from '@mui/material';
import { useRouter } from 'next/router';

import Consts from 'utils/Consts';

const MiniText = ({ text }) => {
  const router = useRouter();

  const imageUrl = text.photo_id
    ? Consts.IMAGE_STORE_URL + text.photo_id + '.png'
    : '/cover-default.svg';

  const handleTextClick = () => {
    router.push(`/texts/${text.id}`);
  };

  const handleAuthorClick = () => {
    router.push(`/users/${text.author_id}`);
  };

  return (
    <Box sx={{ display: 'flex', mt: 1 }}>
      <Box
        component='img'
        display='flex'
        sx={{
          width: 100,
          height: 56,
          cursor: 'pointer',
        }}
        onClick={handleTextClick}
        src={imageUrl}
      />
      <Box sx={{ display: 'flex', flexFlow: 'column', py: 0.4, ml: 1 }}>
        <Box
          sx={{
            fontSize: '1.3em',
            fontWeight: 'bold',
            cursor: 'pointer',
            color: Consts.COLOR.Primary,
            '&:hover': {
              color: Consts.COLOR.PrimaryDark,
              textDecoration: 'underline',
            },
          }}
          onClick={handleTextClick}
        >
          {text.title}
        </Box>
        <Box
          sx={{
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
      </Box>
    </Box>
  );
};

export default MiniText;

import StarIcon from '@mui/icons-material/Star';
import { Box, Rating } from '@mui/material';
import Link from 'next/link';

import Consts from 'utils/Consts';
import { omitstr } from 'utils/omitstr';

const TextCard = ({ text }) => {
  const imageUrl = text.photo_id
    ? Consts.IMAGE_STORE_URL + text.photo_id + '.png'
    : '/cover-default.svg';

  return (
    <Box sx={{ p: 1 }}>
      <Link href={`/texts/${text.id}`}>
        <a className='no-hover'>
          <Box
            sx={{
              backgroundColor: '#ffffff',
              width: {
                xs: 150,
                sm: 200,
              },
              '&:hover .child': {
                filter: 'brightness(95%)',
              },
            }}
          >
            <Box
              className='child'
              component='img'
              sx={{
                display: 'block',
                mb: 1,
                width: { xs: 150, sm: 200 },
                height: { xs: 84, sm: 112 },
              }}
              src={imageUrl}
            />

            <Box
              className='two-line'
              sx={{ fontWeight: 'bold', fontSize: '1.0em', wordBreak: 'break-all' }}
            >
              {text.title}
            </Box>
            <Box className='one-line' sx={{ fontSize: '0.8em', wordBreak: 'break-all' }}>
              {text.author_display_name}
            </Box>
            <Box sx={{ fontSize: '0.8em', color: '#555555', display: 'flex' }}>
              <Rating
                name='size-small'
                defaultValue={text.rate}
                size='small'
                readOnly
                precision={0.5}
                sx={{ mr: 1 }}
                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize='inherit' />}
              />
              {text.number_of_reviews}
            </Box>
            <Box sx={{ fontWeight: 'bold', fontSize: '0.8em' }}>￥{text.price}</Box>
          </Box>
        </a>
      </Link>
    </Box>
  );
};

export default TextCard;

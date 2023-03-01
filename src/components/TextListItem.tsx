import StarIcon from '@mui/icons-material/Star';
import { Box, Rating, Skeleton } from '@mui/material';
import Link from 'next/link';

import Consts from 'utils/Consts';
import { omitstr } from 'utils/omitstr';

const TextListItem = ({ text }) => {
  const imageUrl = text.photo_id
    ? Consts.IMAGE_STORE_URL + text.photo_id + '.png'
    : '/cover-default.svg';
  return (
    <Link href={`/texts/${text.id}`}>
      <a className='no-hover' sx={{ display: 'block', width: '100%' }}>
        <Box
          sx={{
            width: '100%',
            p: { xs: 0.4, sm: 1 },
            '&:hover .child': {
              filter: 'brightness(95%)',
            },
            display: 'flex',
          }}
        >
          <Box sx={{ width: 100, mr: 0.5 }}>
            <Box
              className='child'
              component='img'
              sx={{
                display: 'block',
                mb: 1,
                width: 100,
                height: 56,
              }}
              src={imageUrl}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <Box
              className='two-line'
              sx={{ fontWeight: 'bold', fontSize: '0.9em', wordBreak: 'break-all' }}
            >
              {text.title}
            </Box>
            <Box sx={{ color: '#000000', fontWeight: 'bold', fontSize: '0.8em' }}>
              ￥{text.price}
            </Box>
            <Box sx={{ fontSize: '0.8em', color: '#555555', display: 'flex' }}>
              <Rating
                name='size-small'
                defaultValue={text.rate}
                size='small'
                readOnly
                precision={0.5}
                sx={{ mr: 0.7 }}
                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize='inherit' />}
              />
              {text.number_of_reviews}
            </Box>
          </Box>
        </Box>
      </a>
    </Link>
  );
};

export default TextListItem;

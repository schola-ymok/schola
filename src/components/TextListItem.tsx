import StarIcon from '@mui/icons-material/Star';
import { Box, Rating, Skeleton } from '@mui/material';
import Link from 'next/link';

import Consts from 'utils/Consts';

const TextListItem = ({ text }) => {
  return (
    <Link href={`/texts/${text.id}`}>
      <a className='no-hover' sx={{ display: 'block', width: '100%' }}>
        <Box sx={{ width: '100%', p: { xs: 0.4, sm: 1 }, display: 'flex' }}>
          <Box sx={{ width: 100, mr: 0.5 }}>
            {text.photo_id != null ? (
              <Box
                component='img'
                sx={{
                  display: 'block',
                  mb: 1,
                  width: 100,
                  height: 56,
                }}
                src={Consts.IMAGE_STORE_URL + text.photo_id + '.png'}
              />
            ) : (
              <Skeleton variant='rectangular' sx={{ mb: 1, mr: 0.5, width: 100, height: 56 }} />
            )}
          </Box>
          <Box fullWidth sx={{ width: '100%' }}>
            <Box sx={{ fontWeight: 'bold', fontSize: '0.9em' }}>
              {text.title?.substring(0, 40)}
              {text.title?.length > 40 && <>...</>}
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

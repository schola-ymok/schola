import { Box, Rating } from '@mui/material';
import Link from 'next/link';

import Consts from 'utils/Consts';

import AvatarButton from './AvatarButton';
import ReadMoreText from './ReadMoreText';

const ReviewItem = ({ review, height = '100' }) => {
  return (
    <>
      <Link href={`/users/${review.user_id}`}>
        <a style={{ display: 'flex', width: 'fit-content' }}>
          <AvatarButton photoId={review.user_photo_id} size={35} />
          <Box
            sx={{
              my: 'auto',
              ml: 1,
              fontSize: '0.9em',
              color: '#000000',
              cursor: 'pointer',
              '&:hover': {
                color: Consts.COLOR.Primary,
                textDecoration: 'underline',
              },
            }}
          >
            {review.user_display_name}
          </Box>
        </a>
      </Link>
      <Box sx={{ display: 'flex', mt: 1 }}>
        <Rating readOnly value={review.rate} size='small' />
        <Link
          style={{ textDecoration: 'none' }}
          href={`/texts/${review.text_id}/reviews/${review.id}`}
        >
          <a>
            <Box
              sx={{
                my: 'auto',
                ml: 1,
                fontWeight: 'bold',
                fontSize: '0.9em',
                color: '#000000',
                cursor: 'pointer',
                '&:hover': {
                  color: Consts.COLOR.Primary,
                  textDecoration: 'underline',
                },
                wordBreak: 'break-all',
              }}
            >
              {review.title}
            </Box>
          </a>
        </Link>
      </Box>
      <Box sx={{ fontSize: '0.9em', color: '#777777' }}>
        {new Date(review.updated_at).toLocaleDateString('ja')}
      </Box>
      <Box sx={{ mb: 2 }}>
        <ReadMoreText id={review.id} height={height} fontSize={'0.9em'}>
          <Box
            sx={{
              whiteSpace: 'pre-wrap',
            }}
          >
            {review.comment}
          </Box>
        </ReadMoreText>
      </Box>
    </>
  );
};

export default ReviewItem;

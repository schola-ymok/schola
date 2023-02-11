import { Box, Rating } from '@mui/material';
import { useRouter } from 'next/router';

import Consts from 'utils/Consts';
import { omitstr } from 'utils/omitstr';

import AvatarButton from './AvatarButton';
import ReadMoreText from './ReadMoreText';

const ReviewItem = ({ review, height = '100' }) => {
  const router = useRouter();

  const handleUserClick = () => {
    router.push(`/users/${review.user_id}`);
  };

  const handleReviewClick = () => {
    router.push(`/texts/${review.text_id}/reviews/${review.id}`);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex' }}>
        <AvatarButton photoId={review.user_photo_id} onClick={handleUserClick} size={35} />
        <Box
          sx={{
            my: 'auto',
            ml: 1,
            fontSize: '0.9em',
            cursor: 'pointer',
            '&:hover': {
              color: Consts.COLOR.Primary,
              textDecoration: 'underline',
            },
          }}
          onClick={handleUserClick}
        >
          {review.user_display_name}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', mt: 1 }}>
        <Rating readOnly value={review.rate} size='small' />
        <Box
          sx={{
            my: 'auto',
            ml: 1,
            fontWeight: 'bold',
            fontSize: '0.9em',
            cursor: 'pointer',
            '&:hover': {
              color: Consts.COLOR.Primary,
              textDecoration: 'underline',
            },
            wordBreak: 'break-all',
          }}
          onClick={handleReviewClick}
        >
          {review.title}
        </Box>
      </Box>
      <Box sx={{ fontSize: '0.9em', color: '#777777' }}>
        {new Date(review.updated_at).toLocaleDateString('ja')}
      </Box>
      <Box sx={{ mb: 2 }}>
        <ReadMoreText id={review.id} height={height} fontSize={'0.9em'}>
          {review.comment}
        </ReadMoreText>
      </Box>
    </Box>
  );
};

export default ReviewItem;

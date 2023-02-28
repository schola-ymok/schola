import StarIcon from '@mui/icons-material/Star';
import { Box, Rating } from '@mui/material';
import router from 'next/router';

import Consts from 'utils/Consts';

import DashboardTextListMenuButton from './DashboardTextListMenuButton';

const DashboardTextListItem = ({ text, handleDeleteText, handleEditText }) => {
  const handleTextClick = () => {
    if (text.is_public) {
      router.push(`/texts/${text.id}`);
    } else {
      handleEditText(text.id);
    }
  };

  const imageUrl = text.photo_id
    ? Consts.IMAGE_STORE_URL + text.photo_id + '.png'
    : '/cover-default.svg';

  let stateLabel = '下書き中';
  if (text.state == Consts.TEXTSTATE.DraftBanned || text.state == Consts.TEXTSTATE.DraftRejected) {
    stateLabel = '下書き中（事務局コメントあり）';
  } else if (
    text.state == Consts.TEXTSTATE.Selling ||
    text.state == Consts.TEXTSTATE.SellingWithReader
  ) {
    if (text.is_public) {
      stateLabel = '販売中(公開)';
    } else {
      stateLabel = '販売中(非公開)';
    }
  } else if (text.state == Consts.TEXTSTATE.UnderReview) {
    stateLabel = '審査中';
  }

  return (
    <>
      <Box
        sx={{
          width: '100%',
          p: { xs: 0.4, sm: 1 },
          display: 'flex',
          '&:hover .child': {
            filter: 'brightness(95%)',
          },
        }}
      >
        <Box sx={{ width: 100, mr: 0.5 }}>
          <Box
            className='child'
            component='img'
            sx={{
              display: 'block',
              my: 'auto',
              width: 100,
              height: 56,
              cursor: 'pointer',
            }}
            src={imageUrl}
            onClick={handleTextClick}
          />
          <Box
            sx={{
              mx: 'auto',
              fontSize: '0.8em',
              color: Consts.COLOR.PrimaryDark,
              borderRadius: '5px',
              mt: 0.5,
              px: 0.5,
              width: 'fit-content',
              textAlign: 'center',
              border: '1px solid ' + Consts.COLOR.PrimaryDark,
            }}
          >
            {stateLabel}
          </Box>
        </Box>
        <Box fullWidth sx={{ width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{ display: 'flex', flexFlow: 'column', width: '90%', cursor: 'pointer' }}
              onClick={handleEditText}
            >
              <Box sx={{ display: 'flex' }}>
                <Box
                  sx={{ fontWeight: 'bold', fontSize: '1.0em', my: 'auto', wordBreak: 'break-all' }}
                >
                  {text.title?.substring(0, 40)}
                  {text.title?.length > 40 && <>...</>}
                </Box>
              </Box>

              <Box sx={{ display: 'flex' }}>
                <Box sx={{ color: '#000000', fontWeight: 'bold', fontSize: '0.8em' }}>
                  ￥{text.price}
                </Box>
                <Box sx={{ fontSize: '0.8em', ml: 1 }}>販売数:{text.number_of_sales}</Box>
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
            <Box>
              <Box sx={{ display: 'flex', flexFlow: 'column', height: '100%' }}>
                <Box sx={{ display: 'flex' }}>
                  <DashboardTextListMenuButton
                    isReleased={text.is_public}
                    handleDelete={handleDeleteText}
                    handleView={handleTextClick}
                    handleEdit={handleEditText}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default DashboardTextListItem;

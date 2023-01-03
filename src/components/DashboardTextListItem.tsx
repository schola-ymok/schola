import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import { Box, Divider, IconButton, Rating } from '@mui/material';
import router from 'next/router';

import Consts from 'utils/Consts';

const DashboardTextListItem = ({ text, handleDeleteText, handleEditText }) => {
  const EditIcon = ({ onClick }) => {
    return (
      <IconButton
        type='button'
        sx={{
          my: 'auto',
          p: 0,
          '&:hover': Consts.SX.IconButtonHover,
        }}
        onClick={onClick}
      >
        <Edit sx={{ transform: 'scale(0.8)' }} />
      </IconButton>
    );
  };

  const DeleteIcon = ({ onClick }) => {
    return (
      <IconButton
        type='button'
        sx={{
          my: 'auto',
          p: 0,
          '&:hover': Consts.SX.IconButtonHover,
        }}
        onClick={onClick}
      >
        <Delete sx={{ transform: 'scale(0.8)' }} />
      </IconButton>
    );
  };

  const handleTextClick = () => {
    if (text.is_released) {
      router.push(`/texts/${text.id}`);
    } else {
      handleEditText(text.id);
    }
  };

  const imageUrl = text.photo_id
    ? Consts.IMAGE_STORE_URL + text.photo_id + '.png'
    : '/cover-default.svg';

  return (
    <>
      <Box
        sx={{
          width: '100%',
          p: { xs: 0.4, sm: 1 },
          display: 'flex',
        }}
      >
        <Box sx={{ width: 100, mr: 0.5 }}>
          <Box
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
        </Box>
        <Box fullWidth sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box
              sx={{ display: 'flex', flexFlow: 'column', width: '80%', cursor: 'pointer' }}
              onClick={handleTextClick}
            >
              <Box sx={{ fontWeight: 'bold', fontSize: '1.0em', my: 'auto' }}>
                {text.title?.substring(0, 40)}
                {text.title?.length > 40 && <>...</>}
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
              <Box sx={{ display: 'flex', flexFlow: 'column', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex' }}>
                  <EditIcon onClick={() => handleEditText(text.id)} />
                  <DeleteIcon onClick={() => handleDeleteText(text.id)} />
                </Box>
                <Box sx={{ fontSize: '0.8em' }}>{text.is_released ? '公開済' : '下書き'}</Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Divider />
    </>
  );
};

export default DashboardTextListItem;

import InsertPhotoIcon from '@mui/icons-material/InsertPhotoOutlined';
import { IconButton } from '@mui/material';

import Consts from 'utils/Consts';

const EditorButtonImage = ({ handleSelectFile }) => {
  return (
    <>
      <IconButton
        type='button'
        component='label'
        sx={{
          '&:hover': Consts.SX.IconButtonHover,
        }}
      >
        <InsertPhotoIcon sx={{ transform: 'scale(0.9)' }} />
        <input
          type='file'
          accept='image/*'
          onChange={handleSelectFile}
          style={{ display: 'none' }}
        />
      </IconButton>
    </>
  );
};

export default EditorButtonImage;

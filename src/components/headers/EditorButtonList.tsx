import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import {
    IconButton
} from '@mui/material';
import Consts from 'utils/Consts';

const EditorButtonList = ({ onClick }) => {
  return (
    <>
      <IconButton
        type='button'
        sx={{
          '&:hover': Consts.SX.IconButtonHover,
        }}
        onClick={onClick}
      >
        <FormatListBulletedIcon sx={{ transform: 'scale(0.9)' }} />
      </IconButton>
    </>
  );
};

export default EditorButtonList;

import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import {
    IconButton
} from '@mui/material';
import Consts from 'utils/Consts';

const NotificationIcon = ({ onClick }) => {
  return (
    <>
      <IconButton
        type='button'
        sx={{
          pr: 1,
          '&:hover': Consts.SX.IconButtonHover,
        }}
        onClick={onClick}
      >
        <NotificationsOutlinedIcon sx={{ transform: 'scale(1.2)' }} />
      </IconButton>
    </>
  );
};

export default NotificationIcon;

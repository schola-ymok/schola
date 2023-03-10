import { Avatar } from '@mui/material';

import Consts from 'utils/Consts';

const AvatarButton = ({ photoId, size }) => {
  const imageUrl = photoId ? Consts.IMAGE_STORE_URL + photoId + '.png' : '/avatar-default.svg';

  return <Avatar sx={{ width: size, height: size, cursor: 'pointer' }} src={imageUrl} />;
};
export default AvatarButton;

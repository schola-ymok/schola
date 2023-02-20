import { Box, Slider, useMediaQuery } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import Cropper from 'react-easy-crop';

import DefaultButton from './DefaultButton';

const ImageCropDialog = ({
  open,
  setOpen,
  image,
  crop,
  zoom,
  onCropChange,
  onCropComplete,
  onZoomChange,
  showCroppedImage,
  cropShape,
  cropSize,
  avatar,
}) => {
  const handleClose = () => setOpen(false);

  const style = {
    containerStyle: {
      width: '100%',
      margin: 'auto',
    },
  };

  const objectFit = avatar ? 'contain' : 'horizontal-cover';

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <Box className='ImageCropDialog-container'>
          <Cropper
            style={style}
            image={image}
            crop={crop}
            zoom={zoom}
            cropShape={cropShape ?? 'round'}
            cropSize={cropSize ?? { width: 128, height: 128 }}
            onCropChange={onCropChange}
            onCropComplete={onCropComplete}
            objectFit={objectFit}
          />
        </Box>
        <Box sx={{ display: 'flex', flexFlow: 'column' }}>
          <Slider
            defaultValue={0}
            onChange={(evt, value) => {
              onZoomChange((100 + value * 2) / 100);
            }}
            sx={{ width: '85%', mx: 'auto' }}
          />
          <Box sx={{ display: 'flex', mt: 2 }}>
            <DefaultButton sx={{ ml: 'auto', mr: 1 }} onClick={handleClose}>
              キャンセル
            </DefaultButton>
            <DefaultButton
              sx={{ mr: 3, mb: 2 }}
              onClick={() => {
                showCroppedImage();
                handleClose();
              }}
            >
              OK
            </DefaultButton>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default ImageCropDialog;

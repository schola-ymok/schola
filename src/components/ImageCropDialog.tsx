import { Box, Slider } from '@mui/material';
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
}) => {
  const handleClose = () => setOpen(false);

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <Box className='ImageCropDialog-container'>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            cropShape={cropShape ?? 'round'}
            cropSize={cropSize ?? { width: 128, height: 128 }}
            aspect={4 / 3}
            onCropChange={onCropChange}
            onCropComplete={onCropComplete}
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

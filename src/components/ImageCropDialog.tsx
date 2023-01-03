import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Cropper from 'react-easy-crop';

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
        <DialogContent>
          <Box sx={{ width: 400, height: 400 }}>
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              cropShape={cropShape ?? 'round'}
              cropSize={cropSize ?? { width: 128, height: 128 }}
              aspect={1}
              onCropChange={onCropChange}
              onCropComplete={onCropComplete}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button
            onClick={() => {
              showCroppedImage();
              handleClose();
            }}
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ImageCropDialog;

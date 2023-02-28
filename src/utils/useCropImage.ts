import { ref, uploadBytes } from 'firebase/storage';
import { useCallback, useState } from 'react';

import { storage } from 'libs/firebase/firebase';

import getCroppedImage from './getCroppedImage';

const useCropImage = (path, onUploadBegin, onUploadComplete) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [imageSrc, setImageSrc] = useState();
  const [openImageCropDialog, setOpenImageCropDialog] = useState(false);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState();
  const [croppedImageSrc, setCroppedImageSrc] = useState('');

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    if (!croppedAreaPixels) return;
    onUploadBegin();
    try {
      const croppedImage = await getCroppedImage(imageSrc, croppedAreaPixels);
      setCroppedImageSrc(URL.createObjectURL(croppedImage));

      const imageRef = ref(storage, path);
      uploadBytes(imageRef, croppedImage, { contentType: 'image/png' }).then((snapshot) => {
        onUploadComplete();
      });
    } catch (e) {
      console.log(e);
    }
  }, [croppedAreaPixels, imageSrc]);

  const handleSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || '');
        setZoom(1);
        setOpenImageCropDialog(true);
      });
      reader.readAsDataURL(e.target.files[0]);
      e.target.value = '';
    }
  };

  return [
    crop,
    setCrop,
    zoom,
    setZoom,
    imageSrc,
    openImageCropDialog,
    setOpenImageCropDialog,
    croppedImageSrc,
    onCropComplete,
    showCroppedImage,
    handleSelectFile,
  ];
};

export default useCropImage;

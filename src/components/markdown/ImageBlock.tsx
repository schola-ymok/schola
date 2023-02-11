const ImageBlock = (props) => {
  const { alt, src, title } = props;

  const widthStr = title;
  if (widthStr) {
    if (widthStr.slice(-1) == '%' || widthStr.slice(-2) == 'px') {
      const unit = widthStr.slice(-1) == '%' ? '%' : 'px';
      const splitWidthStr = widthStr.split(unit);
      if (splitWidthStr.length > 0) {
        const _width = splitWidthStr[0];
        if (Number.isInteger(Number(_width))) {
          const width = Number(_width);
          if (width > 0 && width < 1000) {
            return <img src={src} alt={alt} style={{ width: width + unit }} />;
          }
        }
      }
    }
  }

  return <img src={src} alt={alt} />;
};

export default ImageBlock;

const ImageBlock = (props) => {
  console.log('img&&&----------');
  console.log(props);
  return <img {...props} style={{ width: '20%' }} />;
};

export default ImageBlock;

import { Box } from '@mui/material';

const YoutubeBlock = ({ id }) => (
  <Box sx={{ width: '100%', maxWidth: '560px', aspectRatio: '16/9' }}>
    <iframe
      style={{ width: '100%', height: '100%' }}
      width='560'
      height='315'
      src={'https://www.youtube.com/embed/' + id}
      title='YouTube video player'
      frameBorder='0'
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      allowFullScreen
    ></iframe>
  </Box>
);

export default YoutubeBlock;

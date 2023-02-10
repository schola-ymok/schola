import { Box } from '@mui/material';

//<iframe src="//www.slideshare.net/slideshow/embed_code/key/DvhB5fUUbdUpPq" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/HideyaIkeda1/devopsdays-tokyo-2019-fujitsu" title="DevOpsDays Tokyo 2019 Fujitsu" target="_blank">DevOpsDays Tokyo 2019 Fujitsu</a> </strong> from <strong><a href="//www.slideshare.net/HideyaIkeda1" target="_blank">Hideya Ikeda</a></strong> </div>

const SlideShareBlock = ({ children }) => {
  if (children) {
    const matches = children[0].match(
      /<iframe\s*src="(\/\/www\.slideshare\.net\/slideshow\/embed_code\/key\/?[^"]+)"*\s*[^>]+>/,
    );

    if (matches && matches.length > 0) {
      const src = matches[1];

      return (
        <Box sx={{ width: '100%' }}>
          <iframe
            src={src}
            style={{
              width: '100%',
              height: '485',
              maxWidth: '560px',
              width: '100%',
              overflow: 'hidden',
              display: 'block',
            }}
            height='315'
          ></iframe>
        </Box>
      );
    }
  }

  return <></>;
};

export default SlideShareBlock;

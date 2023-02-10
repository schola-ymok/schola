import { Box } from '@mui/material';

//<iframe height="315" style="max-width: 560px; width: 100%; overflow:hidden; display:block;" src="https://neort.io/embed/bn5ra5s3p9f80jer8jj0?autoStart=true&quality=1&info=true" frameborder="0" sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-downloads" allow="geolocation; microphone; camera; midi; vr" allowfullscreen="true" allowtransparency="true"></iframe>

const NeortBlock = ({ children }) => {
  if (children) {
    const a = children[0].split(/src=/);
    if (a.length > 0) {
      const b = a[1].split(/"/);

      if (b.length > 0) {
        const src = b[1];

        return (
          <Box sx={{ width: '100%' }}>
            <iframe
              src={src}
              style={{ maxWidth: '560px', width: '100%', overflow: 'hidden', display: 'block' }}
              height='315'
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
              sandbox='allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-downloads'
            ></iframe>
          </Box>
        );
      }
    }
  }

  return <></>;
};

export default NeortBlock;

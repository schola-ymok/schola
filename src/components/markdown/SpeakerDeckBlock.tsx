import { Box } from '@mui/material';

//<iframe class="speakerdeck-iframe" frameborder="0" src="https://speakerdeck.com/player/98ea5595dd704bf2a804082a7544f93d" title="フロントエンド開発のためのセキュリティ入門" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" style="border: 0px; background: padding-box padding-box rgba(0, 0, 0, 0.1); margin: 0px; padding: 0px; border-radius: 6px; box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 40px; width: 100%; height: auto; aspect-ratio: 560 / 314;" data-ratio="1.78343949044586"></iframe>

const SpeakerDeckBlock = ({ children }) => {
  if (children) {
    const a = children[0].split(/src=/);
    if (a.length > 0) {
      const b = a[1].split(/"/);

      if (b.length > 0) {
        const src = b[1];

        return (
          <Box sx={{ width: '100%' }}>
            <iframe
              className='speakerdeck-iframe'
              src={src}
              style={{
                width: '100%',
                maxWidth: '560px',
                height: 'auto',
                aspectRatio: '560/314',
              }}
              height='315'
            ></iframe>
          </Box>
        );
      }
    }
  }
  return <></>;
};

export default SpeakerDeckBlock;

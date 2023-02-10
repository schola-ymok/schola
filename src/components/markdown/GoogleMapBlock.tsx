import { Box } from '@mui/material';
import { rule } from 'p4-css';

const blockClass = rule({
  d: 'inline-block',
  ov: 'hidden',
  bdrad: '6px',
  maxW: '600px',
  w: '100%',
  '&>iframe': {
    d: 'block',
    ov: 'hidden',
    bd: 0,
    w: '100%',
    h: '360px',
  },
});

const GoogleMapBlock = ({ children }) => {
  if (children) {
    const matches = children[0].match(
      /<iframe\s*src="(https:\/\/www\.google\.com\/maps\/embed\?[^"]+)"*\s*[^>]+>/,
    );

    if (matches && matches.length > 0) {
      const src = matches[1];

      return (
        <Box sx={{ width: '100%' }}>
          <div className={blockClass}>
            <iframe
              src={src}
              width='600'
              height='450'
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
            ></iframe>
          </div>
        </Box>
      );
    }
  }
  /*
const GoogleMapBlock = ({ lat, lng }) => (
  <div className={blockClass}>
    <iframe
      allowFullScreen
      src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d21948.472927059174!2d${encodeURIComponent(
        lng,
      )}!3d${encodeURIComponent(
        lat,
      )}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sch!4v1551898961513`}
    />
  </div>
);
*/
  return <></>;
};
export default GoogleMapBlock;

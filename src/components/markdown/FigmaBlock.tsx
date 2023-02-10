import { Box } from '@mui/material';

//<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2Fj51f1AUIo9lwWbFsjqy8l7%2FNB-heatmap-(Community)%3Fnode-id%3D0%253A1%26t%3Dtq16yGCYJ6MeLsg0-1" allowfullscreen></iframe>

const FigmaBlock = ({ children }) => {
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
              style={{
                border: '1px solid rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '560px',
                height: 'auto',
                aspectRatio: '800/450',
              }}
            ></iframe>
          </Box>
        );
      }
    }
  }
  return <></>;
};

export default FigmaBlock;

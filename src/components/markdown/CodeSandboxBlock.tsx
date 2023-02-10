import { Box } from '@mui/material';

/*
<iframe src="https://codesandbox.io/embed/react-new?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="React"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
   */

const CodeSandboxBlock = ({ children }) => {
  if (children) {
    const matches = children[0].match(
      /<iframe\s*src="(https:\/\/codesandbox\.io\/embed\/?[^"]+)"*\s*[^>]+>/,
    );

    if (matches && matches.length > 0) {
      const src = matches[1];

      return (
        <Box sx={{ width: '100%' }}>
          <iframe
            src={src}
            style={{
              width: '100%',
              height: '500px',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          ></iframe>
        </Box>
      );
    }
  }

  return <></>;
};

export default CodeSandboxBlock;

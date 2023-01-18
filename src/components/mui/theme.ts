import { red } from '@mui/material/colors';
import { createTheme, Shadows } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  shape: {
    borderRadius: 0,
  },
  shadows: Array(25).fill('none') as Shadows,
  typography: {
    fontFamily: [
      'Meiryo',
      '"Helvetica Neue"',
      'sans-serif',
      '"Hiragino Kaku Gothic ProN"',
      '"Hiragino Sans"',
      'Arial',
    ].join(','),
    fontSize: 14,
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
    },
    MuiContainer: {
      defaultProps: {
        disableGutters: true,
      },
    },
  },
  palette: {
    primary: {
      main: '#008080',
    },
    secondary: {
      main: '#aaaaaa',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;

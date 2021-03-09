import { createMuiTheme } from '@material-ui/core/styles';

// Create a theme instance.
export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#260A3F',
    },
    secondary: {
      main: '#23BFC1',
      light: '#A5C8D1',
    },
    error: {
      main: '#EA526F',
    },
    success: {
      main: '#50C878',
    },
    background: {
      default: '#FFFFFF',
      paper: '#EADEF4',
    },
    text: {
      primary: '#FFF',
      secondary: '#F2F2F2',
      disabled: '#6A6A6A',
    },
  },
  typography: {
    h1: {
      fontSize: '2.75rem',
    },
    h2: {
      fontSize: '1.75rem',
    },
    body1: {
      fontSize: '1.25rem',
    },
    body2: {
      fontSize: '0.75rem',
    },
  },
});
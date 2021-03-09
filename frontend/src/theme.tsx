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
      primary: '#FFF', // white
      secondary: '#EDB93C', // yellow
      disabled: '#000', // This will be our black used only at login
    },
  },
  typography: {
    fontFamily: [
        'Nunito'
    ].join(','),
    h1: {
        fontSize: '2.75rem',
        fontWeight: 'bold'
    },
    h2: {
        fontSize: '1.75rem',
        fontWeight: 'bold'
    },
    h3: {
        fontSize: '1.25rem',
        fontWeight: 'bold'
    },
    body1: {
        fontSize: '1.25rem',
    },
    body2: {
        fontSize: '0.75rem',
    },
    
  },
});
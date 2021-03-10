import { createMuiTheme } from '@material-ui/core/styles';

// Create a theme instance.
export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#EDB93C',
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
    fontFamily: 'Nunito',
    h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
        lineHeight: '2em'
    },
    h2: {
        fontSize: '1.75rem',
        fontWeight: 400
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 300
    },

    subtitle1: {
      fontSize: '7.5rem',
      fontWeight: 600,
      lineHeight: '1em'
    },
    
    caption: { // NavBar links
      fontSize: '1.1rem',
      fontWeight: 600
  },
    body1: {
      fontSize: '1rem',
      fontWeight: 300
    },
    body2: {
      fontSize: '0.75rem',
      fontWeight: 200
    },
    overline: {
      fontSize: '1rem',
      fontWeight: 400,
      fontStyle: "italic",
      textTransform: "none"
    },
    button: {
      fontSize: '1rem',
      fontWeight: 700,
      padding: "10px",
      textTransform: "none"
    }
    
  },
});
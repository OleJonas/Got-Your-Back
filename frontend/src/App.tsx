import React from 'react';
import './styles/App.css';
import Routing from './Routing';
import { ThemeProvider } from '@material-ui/core';
import { theme } from './theme'

const App = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Routing />
      </ThemeProvider>
    </>
  );
}

export default App;

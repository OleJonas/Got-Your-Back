import React from 'react';
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

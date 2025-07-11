// src/components/ThemeProvider.js
import React, { useState } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';

const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const theme = createTheme({
    // palette: {
    //   mode: darkMode ? 'dark' : 'light',
    //   primary: darkMode ? purple : green,
    // },
    
  });

  return (  
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children({ darkMode, toggleDarkMode })}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;

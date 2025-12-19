import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SignInCard from './SignInCard';
import Content from './Content';
import logo from '../assets/images/logo.png';

const theme = createTheme({
  palette: {
    primary: {
      main: '#D4A018',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default function SignInSide() {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundColor: '#1a2744',
            minHeight: '100vh',
            padding: 0,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '100%',
              height: '40%',
              backgroundImage: 'url(/logo.png)',
              backgroundSize: 'contain',
              backgroundPosition: 'bottom right',
              backgroundRepeat: 'no-repeat',
              opacity: 0.1,
            }}
          />
          
          <Box sx={{ pt: 6, pb: 3, textAlign: 'center', zIndex: 1 }}>
            <img src={logo} alt="Biomed Logo" style={{ width: '160px', height: 'auto' }} />
            <Typography
              variant="caption"
              sx={{
                color: '#ABB738',
                display: 'block',
                mt: 0.5,
                fontStyle: 'italic',
                letterSpacing: 1,
                fontSize: '0.75rem',
              }}
            >
              The Biohazard Professionals
            </Typography>
          </Box>
          
          <Box sx={{ width: '100%', px: 2, zIndex: 1, flex: 1 }}>
            <SignInCard />
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          flexDirection: 'row',
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1a2744',
            padding: 6,
            minHeight: '100vh',
          }}
        >
          <Content />
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            padding: 4,
            minHeight: '100vh',
          }}
        >
          <SignInCard />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

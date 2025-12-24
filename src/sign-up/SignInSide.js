import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SignInCard from './SignInCard';
import Content from './Content';
import logo from "../assets/images/white-logo.png"

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
              backgroundImage: 'url(/white-logo.png)',
              backgroundSize: 'contain',
              backgroundPosition: 'bottom right',
              backgroundRepeat: 'no-repeat',
              opacity: 0.1,
            }}
          />
          
          <Box sx={{ pt: 6, pb: 3, textAlign: 'center', zIndex: 1 }}>
            <img src={logo} alt="Biomed Logo" style={{ width: '160px', height: 'auto' }} />
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
            position: "relative",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: "url('/sign-bg.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "#0D2477",
            padding: 6,
            minHeight: '100vh',
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#0D2477",
              opacity: 0.85,
              zIndex: 1,
            },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Content />
          </Box>
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

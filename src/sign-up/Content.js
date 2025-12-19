import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import logo from '../assets/images/logo.png';

const items = [
  {
    icon: <CheckIcon sx={{ color: '#ffffff', fontSize: 20 }} />,
    title: 'Services',
    description:
      'We are a medical waste transport and medical waste disposal service company proudly serving the Province of Saskatchewan, Canada.',
  },
  {
    icon: <ThumbUpIcon sx={{ color: '#ffffff', fontSize: 20 }} />,
    title: 'Great Customer Reviews',
    description:
      `Don't be fooled by foreign competitors who haul the waste but cannot process it. At Biomed, our experience, expertise and excellent customer service outclasses any of our challengers, regardless of their pomp, circumstance and industry buzzwords.`,
  },
  {
    icon: <AutoFixHighIcon sx={{ color: '#ffffff', fontSize: 20 }} />,
    title: 'Innovative functionality',
    description:
      'Stay ahead with features that set new standards, addressing your evolving needs better than the rest.',
  },
];

export default function Content() {
  return (
    <Stack
      sx={{
        flexDirection: 'column',
        alignSelf: 'center',
        gap: 4,
        maxWidth: 500,
        px: 2,
      }}
    >
      <Box sx={{ mb: 2 }}>
        <img src={logo} alt="Biomed Logo" style={{ width: '220px', height: 'auto' }} />
        <Typography
          variant="caption"
          sx={{
            color: '#ffffff',
            display: 'block',
            mt: 0.5,
            fontStyle: 'italic',
            letterSpacing: 1,
          }}
        >
          The Biohazard Professionals
        </Typography>
      </Box>
      
      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2, alignItems: 'flex-start' }}>
          <Box
            sx={{
              mt: 0.5,
              flexShrink: 0,
            }}
          >
            {item.icon}
          </Box>
          <Box>
            <Typography
              gutterBottom
              sx={{
                fontWeight: 600,
                color: '#ffffff',
                fontSize: '1rem',
              }}
            >
              {item.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: 1.6,
                fontSize: '0.875rem',
              }}
            >
              {item.description}
            </Typography>
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}

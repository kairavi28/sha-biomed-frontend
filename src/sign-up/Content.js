import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import logo from '../assets/images/logo.png'

const items = [
  {
    icon: <ConstructionRoundedIcon sx={{ color: '#D4ED31' }} />,
    title: 'Services',
    description:
      'We are a medical waste transport and medical waste disposal service company proudly serving the Province of Saskatchewan, Canada.',
  },
  {
    icon: <ThumbUpAltRoundedIcon sx={{ color: '#D4ED31' }} />,
    title: 'Great Customer Reviews',
    description:
      `Don't be fooled by foreign competitors who haul the waste but cannot process it. At Biomed, our experience, expertise and excellent customer service otuclasses any of our challengers, regardless of their pomp, circumstance and industry buzzwords.`,
  },
  {
    icon: <AutoFixHighRoundedIcon sx={{ color: '#D4ED31' }} />,
    title: 'Innovative functionality',
    description:
      'Stay ahead with features that set new standards, addressing your evolving needs better than the rest.',
  },
];

export default function Content() {
  return (
    <Stack
      sx={{ flexDirection: 'column', alignSelf: 'center', gap: 4, maxWidth: 450 }}
    >
      <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
      <img src={logo} alt="Logo" style={{ width: '200px', height: 'auto' }} />
      </Box>
      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {item.icon}
          <div>
            <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}

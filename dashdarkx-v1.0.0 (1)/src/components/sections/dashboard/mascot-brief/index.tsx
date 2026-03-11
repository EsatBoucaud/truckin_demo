import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  BRAND_NAME,
  MASCOT_NAME,
  MASCOT_QUIPS,
  MASCOT_VIDEO_SRC,
} from 'config/branding';

const QUIP_INTERVAL_MS = 5000;

const MascotBrief = () => {
  const [activeQuip, setActiveQuip] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveQuip((currentQuip) => (currentQuip + 1) % MASCOT_QUIPS.length);
    }, QUIP_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <Paper sx={{ p: { xs: 2.5, sm: 3 } }}>
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        gap={{ xs: 2.5, sm: 3 }}
        alignItems={{ xs: 'stretch', lg: 'center' }}
        justifyContent="space-between"
      >
        <Stack gap={1.25} maxWidth={640}>
          <Typography variant="h6" fontWeight={600}>
            {BRAND_NAME} mascot desk
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {MASCOT_NAME} keeps the dashboard honest with fast commentary on routes,
            integrations, and the occasional self-inflicted ops problem.
          </Typography>
          <Box
            sx={{
              py: 1.5,
              pl: 2,
              pr: 1,
              borderLeft: 3,
              borderColor: 'primary.main',
            }}
          >
            <Typography variant="body1" fontWeight={500}>
              {MASCOT_QUIPS[activeQuip]}
            </Typography>
          </Box>
        </Stack>

        <Box
          sx={{
            width: { xs: '100%', sm: 240 },
            maxWidth: 240,
            alignSelf: { xs: 'center', lg: 'stretch' },
            border: 1,
            borderColor: 'neutral.darker',
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: 'info.darker',
            flexShrink: 0,
          }}
        >
          <Box
            component="video"
            src={MASCOT_VIDEO_SRC}
            autoPlay
            loop
            muted
            playsInline
            sx={{
              display: 'block',
              width: 1,
              aspectRatio: '1 / 1',
              objectFit: 'cover',
            }}
          />
        </Box>
      </Stack>
    </Paper>
  );
};

export default MascotBrief;

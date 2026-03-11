import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import RateChip from 'components/chips/RateChip';
import DateSelect from 'components/dates/DateSelect';
import CompletedTaskChart from './CompletedTaskChart';

const CompletedTask = () => {
  return (
    <Paper sx={{ height: 300 }}>
      <Typography variant="subtitle1" color="text.secondary">
        Completed loads
      </Typography>

      <Stack mt={1.5} alignItems="center" justifyContent="space-between">
        <Stack alignItems="center" gap={0.875}>
          <Typography variant="h4" fontWeight={600}>
            257
          </Typography>
          <RateChip rate={'16.8%'} isUp={true} />
        </Stack>

        <DateSelect />
      </Stack>

      <Box height={220}>
        <CompletedTaskChart sx={{ height: '100% !important' }} />
      </Box>
    </Paper>
  );
};

export default CompletedTask;

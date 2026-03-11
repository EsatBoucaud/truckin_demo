import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';
import RateChip from 'components/chips/RateChip';

interface TopCardProps {
  icon: string;
  title: string;
  value: string;
  rate: string;
  isUp: boolean;
}

const TopCard = (props: TopCardProps) => {
  const { icon, title, value, rate, isUp } = props;

  return (
    <Grid item xs={12} sm={6} xl={3}>
      <Stack p={2.5} direction="column" component={Paper} gap={2} minHeight={132} width={1}>
        <Stack justifyContent="space-between">
          <Stack direction="column" gap={0.75}>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={600}>
              {value}
            </Typography>
          </Stack>

          <Box
            height={40}
            width={40}
            display="flex"
            alignItems="center"
            justifyContent="center"
            border={1}
            borderColor="neutral.darker"
            borderRadius={1}
            color="primary.main"
          >
            <IconifyIcon icon={icon} fontSize="h6.fontSize" />
          </Box>
        </Stack>

        <RateChip rate={rate} isUp={isUp} />
      </Stack>
    </Grid>
  );
};

export default TopCard;

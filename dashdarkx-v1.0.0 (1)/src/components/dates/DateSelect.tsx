import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const DateSelect = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        views={['month', 'year']}
        defaultValue={dayjs('Jan-2024')}
        format="MMM YYYY"
        sx={(theme) => ({
          '& .MuiInputBase-root': {
            p: 0,
            border: `1px solid ${theme.palette.neutral.darker}`,
            borderRadius: theme.shape.borderRadius,
            background: `${theme.palette.info.main} !important`,
          },
          '& .MuiOutlinedInput-root': {
            pr: 0.75,
            '& .MuiOutlinedInput-notchedOutline': {
              borderWidth: 0,
            },
          },
          '& .MuiOutlinedInput-input': {
            p: 1,
            color: 'text.secondary',
            fontSize: 'caption.fontSize',
            fontWeight: 500,
            width: 72,
          },
          '& .MuiIconButton-edgeEnd': {
            color: 'text.secondary',
            '& .MuiSvgIcon-fontSizeMedium': {
              fontSize: 'subtitle1.fontSize',
            },
          },
        })}
      />
    </LocalizationProvider>
  );
};

export default DateSelect;

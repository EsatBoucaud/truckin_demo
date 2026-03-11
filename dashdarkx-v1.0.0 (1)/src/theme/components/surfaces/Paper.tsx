import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const Paper: Components<Omit<Theme, 'components'>>['MuiPaper'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(3),
      backgroundColor: theme.palette.info.main,
      boxShadow: theme.customShadows[0],
      border: `1px solid ${theme.palette.neutral.darker}`,
      borderRadius: theme.shape.borderRadius + 2,

      '&.MuiMenu-paper': {
        padding: theme.spacing(1),
      },
    }),
  },
};

export default Paper;

import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const Drawer: Components<Omit<Theme, 'components'>>['MuiDrawer'] = {
  styleOverrides: {
    root: {
      '&:hover, &:focus': {
        '*::-webkit-scrollbar, *::-webkit-scrollbar-thumb': {
          visibility: 'visible',
        },
      },
    },
    paper: ({ theme }) => ({
      padding: 0,
      width: '256px',
      height: '100vh',
      borderRadius: 0,
      border: 0,
      borderRight: 1,
      borderStyle: 'solid',
      borderColor: theme.palette.neutral.darker,
      backgroundColor: theme.palette.info.darker,
      boxShadow: 'none',
      boxSizing: 'border-box',
    }),
  },
};

export default Drawer;

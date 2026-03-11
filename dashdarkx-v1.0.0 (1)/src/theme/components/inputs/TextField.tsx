import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const TextField: Components<Omit<Theme, 'components'>>['MuiTextField'] = {
  styleOverrides: {
    root: {},
  },
};

export default TextField;

import { PropsWithChildren } from 'react';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import ButtonBase from '@mui/material/ButtonBase';
import Image from 'components/base/Image';
import { BRAND_LOGO_SRC, BRAND_NAME } from 'config/branding';

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <Stack
      component="main"
      alignItems="center"
      justifyContent="center"
      gap={3}
      px={1}
      py={7}
      width={1}
      minHeight={'100vh'}
    >
      <ButtonBase component={Link} href="/" disableRipple>
        <Image
          src={BRAND_LOGO_SRC}
          alt={BRAND_NAME}
          sx={{ display: 'block', height: 48, width: 'auto', maxWidth: '100%' }}
        />
      </ButtonBase>
      <Paper sx={{ py: 4, width: 1, maxWidth: 460 }}>{children}</Paper>
    </Stack>
  );
};

export default AuthLayout;

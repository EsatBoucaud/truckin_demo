import Typography from '@mui/material/Typography';
import { BRAND_NAME } from 'config/branding';

const Footer = () => {
  return (
    <Typography
      mt={1}
      px={1}
      pb={{ xs: 1.5, sm: 1, lg: 0 }}
      color="text.secondary"
      variant="body2"
      sx={{ textAlign: { xs: 'center', md: 'right' } }}
      letterSpacing={0.5}
    >
      {BRAND_NAME} dashboard
    </Typography>
  );
};

export default Footer;

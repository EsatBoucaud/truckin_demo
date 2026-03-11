import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface ProductInfoProps {
  data: {
    code: string;
    name: string;
    detail: string;
    status: string;
  };
}

const Product = ({ data }: ProductInfoProps) => {
  const { code, name, detail, status } = data;

  return (
    <Stack alignItems="center" justifyContent="space-between">
      <Stack spacing={2} alignItems="center">
        <Box
          height={42}
          width={42}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor="info.dark"
          borderRadius={1}
          border={1}
          borderColor="neutral.darker"
        >
          <Typography variant="caption" color="text.primary">
            {code}
          </Typography>
        </Box>

        <Stack direction="column">
          <Typography variant="body2" fontWeight={600}>
            {name}
          </Typography>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            {detail}
          </Typography>
        </Stack>
      </Stack>

      <Typography variant="caption" fontWeight={500}>
        {status}
      </Typography>
    </Stack>
  );
};

export default Product;

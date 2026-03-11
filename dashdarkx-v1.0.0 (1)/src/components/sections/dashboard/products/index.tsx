import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Product from './Product';

const productsData = [
  {
    id: 1,
    code: 'T-14',
    name: 'Freightliner Cascadia',
    detail: 'Atlanta yard',
    status: 'Ready',
  },
  {
    id: 2,
    code: 'T-09',
    name: 'Volvo VNL 760',
    detail: 'Charlotte yard',
    status: 'Service due',
  },
];

const Products = () => {
  return (
    <Stack direction="column" gap={3.75} component={Paper} height={300}>
      <Typography variant="h6" fontWeight={600}>
        Fleet
      </Typography>

      <Stack justifyContent="space-between">
        <Typography variant="caption" fontWeight={500}>
          Unit
        </Typography>
        <Typography variant="caption" fontWeight={500}>
          Status
        </Typography>
      </Stack>

      {productsData.map((item) => {
        return <Product key={item.id} data={item} />;
      })}
    </Stack>
  );
};

export default Products;

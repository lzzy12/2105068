import { useQuery } from 'react-query';
import { Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';

const fetchProducts = async (company: string) => {
  const response = await fetch(
    `http://20.244.56.144/test/companies/${company}/categories/Phone/products?top=10&minPrice=5000&maxPrice=20000`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch products for ${company}`);
  }
  return response.json();
};

export const CompanyProducts = () => {
  const companies = ['AMZ', 'FLP', 'SNP', 'MYN', 'AZO'];

  return (
    <div>
      {companies.map((company) => (
        <div><CompanyProductGrid key={company} company={company} /></div>
      ))}
    </div>
  );
};

const CompanyProductGrid = ({company}: { company: string}) => {
  const { data, isLoading, error } = useQuery(['products', company], () => fetchProducts(company));

  if (isLoading) return <CircularProgress />;

  if (error) return <Typography variant="h6">Something went wrong</Typography>;

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        {company} Products
      </Typography>
      <Grid container spacing={2}>
        {data.map((product: {productName: String, price: number, rating: number, discount: number, availblity: string}) => (
          <Grid item key={product.productName} xs={12} sm={6} md={4} lg={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">{product.productName}</Typography>
                <Typography variant="body1">Price: ${product.price}</Typography>
                <Typography variant="body2">Rating: {product.rating}</Typography>
                <Typography variant="body2">Discount: {product.discount}%</Typography>
                <Typography variant="body2">Availability: {product.availblity}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default CompanyProducts;

import React, { useEffect, useState } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { 
  BarChart, 
  LineChart,
  PieChart
} from '@mui/x-charts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import axios from 'axios';
import { use } from 'react-router-dom';

const Dashboard = () => {
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [monthLabels, setMonthLabels] = useState([]);
  const [productTrends, setProductTrends] = useState([]);
  const[error,setError]=useState([]);
   const [products, setProducts] = useState([]);
  const [metrics, setMetrics] = useState({
    totalRevenue: '',
    totalOrders: '',
    stockTurnover: '',
    profitMargin: ''
});

useEffect(() => {
    const fetchMetrics = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/orders/metrics');
            console.log('Metrics data:', response.data);
            setMetrics(response.data);
        } catch (error) {
            console.error('Error fetching order metrics:', error);
        }
    };

    fetchMetrics();
}, []);

// Fonction pour récupérer les produits les plus vendus via l'API
useEffect(() => {
    const fetchTopSellingProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/orders/top-selling-products');
        setTopSellingProducts(response.data); // Récupère les données et les stocke dans l'état
      } catch (error) {
        console.error('Error fetching top selling products:', error);
      }
    };

    fetchTopSellingProducts();
  }, []);

  useEffect(() => {
    const fetchMonthlySales = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/orders/sales/monthly');
        const sales = response.data.map(sale => sale.totalSales);
        const months = response.data.map(sale => sale.month);
        setSalesData(sales);
        setMonthLabels(months);
      } catch (error) {
        console.error('Error fetching monthly sales data:', error);
      }
    };

    fetchMonthlySales();
  }, []);
//tendances
  useEffect(() => {
    const fetchProductTrends = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products/trends');
        setProductTrends(response.data);
      }catch (err) {
        console.error('Error fetching product trends:', err);
        setError(err.message); // Stocke l'erreur dans l'état si besoin
    }
    
    };

    fetchProductTrends();
  }, []);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon color="success" />;
      case 'down':
        return <TrendingDownIcon color="error" />;
      case 'stable':
        return <TrendingFlatIcon color="primary" />;
      default:
        return null;
    }
  };

 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProducts();
  }, []);
//préparation des données pour les graphes
  const productNames = products.map(product => product.productName);
  const stockValues = products.map(product => product.stock);
  const salesValues = topSellingProducts.map(product => product.totalSales);

  return (
<Box sx={{ flexGrow: 1, p: 3 }}>
      
    <Grid container spacing={3}>
    <Grid container spacing={3}>
    {[
    { title: "Chiffre d'affaires", value: metrics.totalRevenue, change: metrics.revenueChange || 'N/A' },
    { title: "Nombre de commandes", value: metrics.totalOrders, change: metrics.ordersChange || 'N/A' },
    { title: "Taux de rotation des stocks", value: metrics.stockTurnover, change: metrics.stockTurnoverChange || 'N/A' },
    { title: "Marge bénéficiaire", value: metrics.profitMargin, change: metrics.profitMarginChange || 'N/A' }
].map((metric, index) => (
    <Grid item xs={12} sm={6} md={3} key={index}>
        <Card>
            <CardContent>
                <Typography color="textSecondary" gutterBottom>
                    {metric.title}
                </Typography>
                <Typography variant="h5" component="div">
                    {metric.value}
                </Typography>
                <Typography 
                    color={
                        metric.change === 'N/A' 
                            ? 'textSecondary' 
                            : metric.change.startsWith('+') 
                            ? 'success.main' 
                            : 'error.main'
                    }
                >
                    {metric.change}
                </Typography>
            </CardContent>
        </Card>
    </Grid>
))}


          </Grid>
        {/* Graphique des niveaux de stock */}
        <Grid item xs={12} md={6}>
          <Paper  sx={{ p: 2, mb: 0 }}>
            <Typography variant="h6" gutterBottom>
              Niveaux de Stock
            </Typography>
            <BarChart
              xAxis={[{ scaleType: 'band', data: productNames, tickRotation: -45 }]}
              series={[{ data: stockValues }]}
              width={500}
              height={200}
            />
          </Paper>
        </Grid>

        {/* Graphique des ventes mensuelles */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Ventes Mensuelles
            </Typography>
            <LineChart
              xAxis={[{ data: monthLabels, scaleType: 'band' }]}
              series={[{ data: salesData }]}
              width={500}
              height={300}
            />
          </Paper>
        </Grid>

        {/* Produits les plus vendus */}
        <Grid item xs={12} md={6}>
        <Paper >
          <Typography variant="h6">
            Produits les Plus Vendus
          </Typography>
          <Box >
            <Box sx={{ mr: 5 }}>
          <PieChart 
            series={[{
              data: productNames.map((name, index) => ({ id: name, value: salesValues[index], label: name }))
              .filter(product => product.value > 0)
            }]}
            width={500}
            height={300}
          />
           </Box>
      

      </Box>
        </Paper>
      </Grid>

        {/* Tendances des produits */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tendances des Produits
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Produit</TableCell>
                    <TableCell align="right">Ventes Actuelles</TableCell>
                    <TableCell align="right">Ventes Précédentes</TableCell>
                    <TableCell align="center">Tendance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productTrends.map((product) => (
                    <TableRow key={product.productName}>
                      <TableCell component="th" scope="row">
                        {product.productName}
                      </TableCell>
                      <TableCell align="right">{product.currentSales}</TableCell>
                      <TableCell align="right">{product.previousSales}</TableCell>
                      <TableCell align="center">{getTrendIcon(product.trend)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

       
      </Grid>
    </Box>
  );
};

export default Dashboard;

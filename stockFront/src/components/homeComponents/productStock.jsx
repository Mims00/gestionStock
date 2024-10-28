import React, { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import axios from 'axios';

const ProductStock = () => {
  const [products, setProducts] = useState([]);

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

  const productNames = products.map(product => product.productName);
  const stockValues = products.map(product => product.stock);

  return (
    <div>
      <BarChart
        xAxis={[{ scaleType: 'band', data: productNames,tickRotation: -45, }]}
        series={[{ data: stockValues }]}
        width={800}
        height={400}
      />
    </div>
  );
};

export default ProductStock;

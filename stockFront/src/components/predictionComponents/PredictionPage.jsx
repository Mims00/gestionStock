import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, Typography } from '@mui/material';

const PredictionPage = () => {
  const [data, setData] = useState([]);

  // Appel à l'API pour obtenir les prédictions de réapprovisionnement
  useEffect(() => {
    axios.get('http://localhost:3000/api/predictions')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des prédictions:', error);
      });
  }, []);

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Graphique de prédiction pour le prochain réapprovisionnement</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="product" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="replenishQty" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PredictionPage;

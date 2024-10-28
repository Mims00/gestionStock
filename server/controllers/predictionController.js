const { Product, OrderLine } = require('../models');
const { trainModel, predictReplenishment } = require('../../client/src/api/predictionApi');

let trainedModel = null;

const getPredictions = async (req, res) => {
  try {
    // Récupérer les produits et leurs seuils de stock
    const products = await Product.findAll({
      attributes: ['productId', 'productName', 'stockMin'],
    });

    // Calculer les ventes pour chaque produit
    const salesData = await Promise.all(products.map(async (product) => {
      const totalSales = await OrderLine.sum('qty', { where: { productId: product.productId } });
      return {
        product: product.productName,
        sales: totalSales || 0,
        stockMin: product.stockMin,
      };
    }));

    // Entraîner le modèle ML si nécessaire
    if (!trainedModel) {
      trainedModel = trainModel(salesData);
    }

    // Faire des prédictions de réapprovisionnement
    const predictions = salesData.map((item) => {
      const predictedReplenishment = predictReplenishment(trainedModel, item.sales);
      return {
        product: item.product,
        sales: item.sales,
        replenishQty: Math.round(predictedReplenishment),
        stockMin: item.stockMin,
      };
    });

    // Retourner les prédictions
    res.json(predictions);
  } catch (error) {
    console.error('Erreur dans le contrôleur de prédiction:', error);
    res.status(500).json({ error: 'Erreur lors de la génération des prédictions.' });
  }
};

module.exports = { getPredictions };

const { PolynomialRegression } = require('ml-regression');

// Fonction pour entraîner le modèle de réapprovisionnement (régression polynomiale)
function trainModel(salesData) {
  const inputs = salesData.map(item => item.sales); // Ventes en entrée
  const outputs = salesData.map(item => item.stockMin); // Stock minimum en sortie

  // Utiliser une régression polynomiale de degré 2 (ou plus si nécessaire)
  const regression = new PolynomialRegression(inputs, outputs, 2);
  console.log('Modèle de régression entraîné');
  
  return regression;
}

// Fonction pour prédire la quantité de réapprovisionnement
function predictReplenishment(model, currentSales) {
  return model.predict(currentSales);
}

module.exports = { trainModel, predictReplenishment };

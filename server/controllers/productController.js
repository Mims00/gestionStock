// Importez les fonctions nécessaires
const { OrderLine, Product, Order, sequelize } = require('../models');

const { Op, fn, col } = require('sequelize');

// Create
const createProduct = async (req, res) => {
    console.log('Received request to create product:', req.body);

    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct);
        console.log('Product created:', newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Failed to create product' });
    }
};

// Read
const getProduct = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { productName, descri, price, stock, stockMin } = req.body;
        const product = await Product.findByPk(id);
        if (product) {
            product.productName = productName;
            product.descri = descri;
            product.price = price;
            product.stock = stock;
            product.stockMin = stockMin;
            await product.save();
            res.status(200).json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        if (product) {
            await product.destroy();
            res.status(200).json({ message: 'Product deleted' });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Find by name
const searchProductByName = async (req, res) => {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({ error: 'Provide product\'s name' });
        }
        const products = await Product.findAll({
            where: {
                productName: { // Utiliser 'productName' au lieu de 'name' car c'est le bon champ
                    [Op.like]: `%${name}%`, 
                },
            },
        });
        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(products);
    } catch (error) {
        console.error('Research error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};
const getProductTrends = async (req, res) => {
    try {
        // Date du mois en cours
        const currentMonthStart = new Date();
        currentMonthStart.setDate(1); // Premier jour du mois en cours

        // Date du mois précédent
        const previousMonthStart = new Date(currentMonthStart);
        previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);

        const previousMonthEnd = new Date(currentMonthStart);
        previousMonthEnd.setDate(0); // Dernier jour du mois précédent

        // Ventes du mois en cours
        const currentSales = await OrderLine.findAll({
            attributes: [
                'productId',
                [sequelize.fn('SUM', sequelize.col('qty')), 'currentSales']
            ],
            include: [
                {
                    model: Product,
                    as: 'product',  // Alias utilisé pour l'association Product
                    attributes: ['productName']
                },
                {
                    model: Order,
                    as: 'order',  // Alias utilisé pour l'association Order
                    attributes: [],  // Pas besoin de champs spécifiques
                    where: {
                        orderDate: {
                            [Op.gte]: currentMonthStart
                        }
                    }
                }
            ],
            group: ['productId', 'product.productName']
        });

        // Ventes du mois précédent
        const previousSales = await OrderLine.findAll({
            attributes: [
                'productId',
                [sequelize.fn('SUM', sequelize.col('qty')), 'previousSales']
            ],
            include: [
                {
                    model: Product,
                    as: 'product',  // Alias utilisé pour l'association Product
                    attributes: ['productName']
                },
                {
                    model: Order,
                    as: 'order',  // Alias utilisé pour l'association Order
                    attributes: [],  // Pas besoin de champs spécifiques
                    where: {
                        orderDate: {
                            [Op.between]: [previousMonthStart, previousMonthEnd]
                        }
                    }
                }
            ],
            group: ['productId', 'product.productName']
        });

        // Créer un objet de tendance de produit
        const trends = currentSales.map(current => {
            const previous = previousSales.find(prev => prev.productId === current.productId) || { dataValues: { previousSales: 0 } };

            let trend = 'stable';
            if (current.dataValues.currentSales > previous.dataValues.previousSales) {
                trend = 'up';
            } else if (current.dataValues.currentSales < previous.dataValues.previousSales) {
                trend = 'down';
            }

            return {
                productName: current.product.productName,
                currentSales: current.dataValues.currentSales,
                previousSales: previous.dataValues.previousSales,
                trend
            };
        });

        res.status(200).json(trends);
    } catch (error) {
        console.error('Error fetching product trends:', error);
        res.status(500).json({ message: 'Error fetching product trends' });
    }
};

module.exports = {
    createProduct,
    getProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProductByName,
    getProductTrends,
};

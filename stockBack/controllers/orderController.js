const { Order, OrderLine, sequelize, Customer, DeliveryPerson,User,Notification, Product } = require('../models');
const { createNotification } = require('./notificationController');
const { Op } = require('sequelize');  // Importation d'Op depuis Sequelize

// Récupérer toutes les commandes
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: Customer,
                    as: 'customer', // Alias défini dans l'association entre Order et Customer
                    attributes: ['customerName', 'address', 'phoneNumber']
                },
                {
                    model: DeliveryPerson,
                    as: 'deliveryPerson', // Alias défini dans l'association entre Order et DeliveryPerson
                    attributes: ['deliveryPersName', 'deliveryPersPhone']
                },
                {
                    model: User,
                    as: 'user', // Alias défini dans l'association entre Order et User
                    attributes: ['userName']
                }
            ]
        });
        
        res.status(200).json(orders);
        console.log(orders); 
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.createOrder = async (req, res) => {
    const {
        customerId, 
        userId, 
        deliveryMethod, 
        deliveryAddress, 
        deliveryCost,
        paymentMethod, 
        products, 
        deliveryPersId, 
        discount,
    } = req.body;

    // Valider les données d'entrée de base
    if (!customerId || !deliveryMethod || !paymentMethod || !products || !Array.isArray(products)) {
        console.log('Invalid input data:', { customerId, deliveryMethod, paymentMethod, products });
        return res.status(400).json({ message: 'Invalid input data' });
    }

    // Transaction pour la création de la commande
    const t = await sequelize.transaction();

    try {
        // Créer la commande principale
        const order = await Order.create({
            orderDate: new Date(),
            status: 'En attente',
            deliveryMethod,
            deliveryAddress: deliveryAddress || null, 
            deliveryCost: deliveryCost || 0, 
            paymentMethod,
            discount: discount || 0, 
            discAmount: 0, 
            finalAmount: 0,
            totalAmount: 0,
            customerId, 
            userId: userId || null, 
            deliveryPersId: deliveryPersId || null 
        }, { transaction: t });

        console.log('Order created:', order);

        let totalAmount = 0;

        // Boucle pour créer les lignes de commande
        for (const product of products) {
            // Vérification de la quantité
            if (!product.productId || !product.qty || product.qty <= 0) {
                await t.rollback(); // Annule la transaction si la quantité ou le produit est invalide
                return res.status(400).json({ message: 'Chaque produit doit avoir un ID valide et une quantité supérieure à zéro.' });
            }

            const productData = await Product.findByPk(product.productId, { transaction: t });

            // Vérifier si le produit existe et si le stock est suffisant
            if (!productData) {
                console.log(`Product not found: ${product.productId}`);
                await t.rollback();
                return res.status(400).json({ message: `Product not found: ${product.productId}` });
            }

            if (productData.stock < product.qty) {
                console.log(`Insufficient stock for product ${product.productId}: ${productData.stock} available, ${product.qty} requested`);
                await t.rollback();
                return res.status(400).json({ message: `Insufficient stock for product ${product.productId}` });
            }

            const lineTotal = product.qty * productData.price; 
            totalAmount += lineTotal;

            // Créer une ligne de commande
            await OrderLine.create({
                qty: product.qty, 
                orderId: order.orderId,
                productId: product.productId
            }, { transaction: t });

            // Mettre à jour le stock du produit
            await Product.update(
                { stock: productData.stock - product.qty },
                { where: { productId: product.productId }, transaction: t }
            );

            console.log(`Order line created for product ${product.productId}: ${product.qty} units`);
        }

        // Calculer le montant de la remise
        const discountAmount = (discount / 100) * totalAmount;

        // Mettre à jour le montant total de la commande
        const finalAmount = totalAmount - discountAmount + (deliveryCost || 0);
        await order.update({
            totalAmount: totalAmount + (deliveryCost || 0),
            discAmount: discountAmount, 
            finalAmount
        }, { transaction: t });

        console.log('Final amounts updated:', { totalAmount, discountAmount, finalAmount });

        await t.commit(); 
        res.status(201).json({ message: 'Order created successfully', order });
     } catch (error) {
        console.error('Error creating order:', error);
        await t.rollback(); // Rollback de la transaction en cas d'erreur
        return res.status(500).json({ message: 'Erreur lors de la création de la commande' });
    }
}

// Modifier une commande
exports.updateOrder = async (req, res) => {
    const { orderId } = req.params;
    const updates = req.body;

    try {
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await order.update(updates);
        res.status(200).json({ message: 'Order updated successfully', order });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Annuler une commande
exports.cancelOrder = async (req, res) => {
    const { orderId } = req.params;
    console.log('ID de commande reçu:', orderId);
    try {
        const order = await Order.findByPk(orderId);
        if (!order) {
            console.log('Commande non trouvée dans la base de données'); // Ajoutez ce log
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = 'annulée';
        await order.save();
        res.status(200).json({ message: 'Order cancelled successfully', order });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Valider une commande
exports.validateOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findByPk(orderId, {
            include: [
                {
                    model: Customer,
                    as: 'Customer', // Nom de l'association
                    attributes: ['customerId', 'customerName', 'address', 'phoneNumber']
                },
                {
                    model: OrderLine,
                    attributes: ['orderLineId','productId','qty','orderId'],
                   
                            
                },
                {
                    model: DeliveryPerson,
                    as: 'DeliveryPerson', // Nom de l'association
                    attributes: ['deliveryPersId','deliveryPersName','deliveryPersPhone']
                }
               
            ]
        });
    

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        order.status = 'validée';
        await order.save();
        res.status(200).json({ message: 'Order validated successfully', order });
    } catch (error) {
        console.error('Error validating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
   
    
};
exports.deleteOrder = async (req, res) => {
    const { orderId } = req.params;

    // Démarrer une transaction
    const transaction = await sequelize.transaction();

    try {
        // Rechercher la commande par ID
        const order = await Order.findByPk(orderId, { transaction });

        // Vérifier si la commande existe
        if (!order) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }

        // Supprimer d'abord les lignes de commande associées
        await OrderLine.destroy({ 
            where: { orderId: orderId },
            transaction
        });

        // Supprimer la commande
        await order.destroy({ transaction });

        // Si tout est réussi, commiter la transaction
        await transaction.commit();

        res.status(200).json({ message: 'Commande et ses lignes supprimées avec succès' });
    } catch (error) {
        // En cas d'erreur, annuler la transaction
        await transaction.rollback();
        console.error('Erreur lors de la suppression de la commande et de ses lignes:', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};

exports.getOrdersByCustomer = async (req, res) => {
    const { customerId } = req.params;

    try {
        // Récupérer les commandes du client
        const orders = await Order.findAll({
            where: { customerId }, // Filtrer par customerId
            include: [{ model: Customer }] // Si vous avez des relations à inclure (comme Customer)
        });

        // Vérifier si des commandes sont trouvées
        if (!orders.length) {
            return res.status(404).json({ message: "Aucune commande trouvée pour ce client." });
        }

        res.json(orders);
    } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

// API pour récupérer les détails de la commande par ID
exports.getOrderDetails = async (req, res) => {
    const { orderId } = req.params; // Récupérer l'ID de la commande depuis les paramètres

    try {
        // Récupérer la commande avec les relations (client, produits, livreur)
        const order = await Order.findByPk(orderId, {
            include: [
                {
                    model: Customer,
                    as: 'customer', // Utilisation de l'alias défini dans les associations
                    attributes: ['customerName', 'address', 'phoneNumber']
                },
                {
                    model: OrderLine,
                    as: 'orderLines', // Assurez-vous que l'alias correspond à votre définition
                    include: [
                        {
                            model: Product, // Inclure les détails du produit dans la ligne de commande
                            as: 'product', // Alias défini dans l'association
                            attributes: ['productName', 'price']
                        }
                    ],
                    attributes: ['orderLineId', 'productId', 'qty'] // Attributs de la ligne de commande
                },
                {
                    model: DeliveryPerson,
                    as: 'deliveryPerson', // Alias pour le livreur
                    attributes: ['deliveryPersName', 'deliveryPersPhone']
                }
            ]
        });

        // Vérifier si la commande existe
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Retourner les détails de la commande
        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

 


exports.getMetrics = async (req, res) => {
    try {
        // Date du mois en cours
        const currentMonthStart = new Date();
        currentMonthStart.setDate(1); // Premier jour du mois en cours

        // Date du mois précédent
        const previousMonthStart = new Date(currentMonthStart);
        previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);

        const previousMonthEnd = new Date(currentMonthStart);
        previousMonthEnd.setDate(0); // Dernier jour du mois précédent

        // Calcul du chiffre d'affaires total (somme des montants des commandes)
        const currentRevenue = await Order.sum('totalAmount', {
            where: {
                orderDate: {
                    [Op.gte]: currentMonthStart
                }
            }
        });

        const previousRevenue = await Order.sum('totalAmount', {
            where: {
                orderDate: {
                    [Op.between]: [previousMonthStart, previousMonthEnd]
                }
            }
        });

        // Nombre total de commandes
        const currentOrders = await Order.count({
            where: {
                orderDate: {
                    [Op.gte]: currentMonthStart
                }
            }
        });

        const previousOrders = await Order.count({
            where: {
                orderDate: {
                    [Op.between]: [previousMonthStart, previousMonthEnd]
                }
            }
        });

        // Taux de rotation des stocks
        const currentStockTurnover = await Product.sum('stockMin'); // Cela devrait être modifié pour une logique appropriée
        const previousStockTurnover = await Product.sum('stockMin'); // Idem

        // Marge bénéficiaire (hypothèse simple : 23% du chiffre d'affaires)
        const currentProfitMargin = (currentRevenue * 0.23).toFixed(2);
        const previousProfitMargin = (previousRevenue * 0.23).toFixed(2);

        // Calcul du taux de changement pour chaque métrique
        const revenueChange = previousRevenue ? (((currentRevenue - previousRevenue) / previousRevenue) * 100).toFixed(2) : null;
        const ordersChange = previousOrders ? (((currentOrders - previousOrders) / previousOrders) * 100).toFixed(2) : null;
        const stockTurnoverChange = previousStockTurnover ? (((currentStockTurnover - previousStockTurnover) / previousStockTurnover) * 100).toFixed(2) : null;
        const profitMarginChange = previousProfitMargin ? (((currentProfitMargin - previousProfitMargin) / previousProfitMargin) * 100).toFixed(2) : null;
        console.log('Chiffre d\'affaires actuel :', currentRevenue);
        console.log('Chiffre d\'affaires du mois précédent :', previousRevenue);
        // Préparer la réponse
        res.status(200).json({
            totalRevenue: `${currentRevenue} Ar`,
            totalOrders: currentOrders,
            stockTurnover: currentStockTurnover,
            profitMargin: `${currentProfitMargin} Ar`,
            revenueChange: revenueChange !== null ? `${revenueChange} %` : 'N/A',
            ordersChange: ordersChange !== null ? `${ordersChange} %` : 'N/A',
            stockTurnoverChange: stockTurnoverChange !== null ? `${stockTurnoverChange} %` : 'N/A',
            profitMarginChange: profitMarginChange !== null ? `${profitMarginChange} %` : 'N/A'
        });
    } catch (error) {
        console.error('Error fetching metrics:', error);
        res.status(500).json({ message: 'Error fetching metrics' });
    }
};

exports.getTopSellingProducts = async (req, res) => {
    try {
        // Récupérer les produits avec la somme des ventes
        const topSellingProducts = await OrderLine.findAll({
            attributes: [
                'productId',
                [sequelize.fn('SUM', sequelize.col('qty')), 'totalSales'],
            ],
            include: [{
                model: Product,
                as: 'product', // Utilisation de l'alias défini dans les associations
                attributes: ['productName'], // On récupère uniquement le nom du produit
            }],
            group: ['productId', 'product.productName'], // Grouper par produit
            order: [[sequelize.fn('SUM', sequelize.col('qty')), 'DESC']], // Trier par ventes décroissantes
            limit: 5, 
        });

        // Formater la réponse pour inclure le nom du produit
        const formattedProducts = topSellingProducts.map(product => ({
            productId: product.productId,
            productName: product.product.productName,
            totalSales: product.dataValues.totalSales,
        }));

        res.status(200).json(formattedProducts);
    } catch (error) {
        console.error('Error fetching top selling products:', error);
        res.status(500).json({ message: 'Error fetching top selling products' });
    }
};
exports.getMonthlySales = async (req, res) => {
    try {
        // Récupérer les ventes mensuelles, groupées par mois
        const monthlySales = await Order.findAll({
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('orderDate'), '%Y-%m'), 'month'], // Format YYYY-MM
                [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalSales'],
            ],
            group: [sequelize.fn('DATE_FORMAT', sequelize.col('orderDate'), '%Y-%m')], // Groupement par mois
            order: [[sequelize.fn('DATE_FORMAT', sequelize.col('orderDate'), '%Y-%m'), 'ASC']], // Tri par mois
        });

        res.status(200).json(monthlySales);
    } catch (error) {
        console.error('Error fetching monthly sales:', error);
        res.status(500).json({ message: 'Error fetching monthly sales' });
    }
};


  
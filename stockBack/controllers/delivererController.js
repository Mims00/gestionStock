// controllers/delivererController.js
const DeliveryPerson = require('../models/deliveryPerson'); // Assurez-vous que le chemin est correct
const Order = require('../models/order'); // Assurez-vous que le chemin est correct

// Récupérer tous les livreurs
exports.getAllDeliverers = async (req, res) => {
    try {
        const deliverers = await DeliveryPerson.findAll();
        res.json(deliverers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer un nouveau livreur
exports.createDeliverer = async (req, res) => {
    try {
        const deliverer = await DeliveryPerson.create(req.body);
        res.status(201).json(deliverer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Mettre à jour un livreur
exports.updateDeliverer = async (req, res) => {
    try {
        const deliverer = await DeliveryPerson.findByPk(req.params.id);
        if (deliverer) {
            await deliverer.update(req.body);
            res.json(deliverer);
        } else {
            res.status(404).json({ message: 'Livreur non trouvé' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer un livreur
exports.deleteDeliverer = async (req, res) => {
    try {
        const deliverer = await DeliveryPerson.findByPk(req.params.id);
        if (deliverer) {
            await deliverer.destroy();
            res.json({ message: 'Livreur supprimé' });
        } else {
            res.status(404).json({ message: 'Livreur non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer les commandes d'un livreur
exports.getDelivererOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({ where: { deliveryPersId: req.params.id } });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

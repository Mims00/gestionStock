const Customer = require('../models/customer');

// Récupérer tous les clients
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll();
        res.status(200).json(customers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Créer un nouveau client
exports.createCustomer = async (req, res) => {
    try {
        const { customerName, address, phoneNumber } = req.body;
        const newCustomer = await Customer.create({ customerName, address, phoneNumber });
        res.status(201).json(newCustomer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Mettre à jour un client existant
exports.updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { customerName, address, phoneNumber } = req.body;
        const customer = await Customer.findByPk(id);

        if (customer) {
            customer.customerName = customerName;
            customer.address = address;
            customer.phoneNumber = phoneNumber;
            await customer.save();
            res.status(200).json(customer);
        } else {
            res.status(404).json({ error: 'Customer not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Supprimer un client
exports.deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findByPk(id);

        if (customer) {
            await customer.destroy();
            res.status(200).json({ message: 'Customer deleted' });
        } else {
            res.status(404).json({ error: 'Customer not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

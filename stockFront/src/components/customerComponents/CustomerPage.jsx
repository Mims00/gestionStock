import React, { useState, useEffect } from 'react';
import CustomerForm from './CustomerForm';
import CustomerTable from './CustomerTable';
import { Container, Typography, Box, Fab, Dialog, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../../api/customerApi';

const CustomerPage = () => {
    const [customers, setCustomers] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // État pour le terme de recherche
    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const data = await getCustomers();
            setCustomers(data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const handleClickOpen = () => {
        setSelectedCustomer(null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSuccessMessage('');
    };

    const handleSave = async (customerData) => {
        try {
            if (selectedCustomer) {
                await updateCustomer(selectedCustomer.customerId, customerData);
                setSuccessMessage('Client modifié avec succès !');
            } else {
                await createCustomer(customerData);
                setSuccessMessage('Client ajouté avec succès !');
            }
            fetchCustomers();
            handleClose();
        } catch (error) {
            console.error('Error saving customer:', error);
        }
    };

    const handleEdit = (customer) => {
        setSelectedCustomer(customer);
        setOpen(true);
    };

    const handleDeleteConfirm = (customerId) => {
        setCustomerToDelete(customerId);
        setConfirmDelete(true);
    };

    const handleDelete = async () => {
        try {
            await deleteCustomer(customerToDelete);
            setSuccessMessage('Client supprimé avec succès !');
            fetchCustomers();
            setConfirmDelete(false);
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    };

    const handleCancelDelete = () => {
        setConfirmDelete(false);
    };

    // Fonction pour naviguer vers la liste des commandes d'un client spécifique
    const handleViewOrders = (customerId) => {
        navigate(`/order-list?customerId=${customerId}`); 
    };

    // Filtrer les clients en fonction du terme de recherche
    const filteredCustomers = customers.filter(customer =>
        customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phoneNumber.startsWith(searchTerm)
    );

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Clients
            </Typography>

            <Box mb={2}>
                {/* Barre de recherche */}
                <TextField
                    label="Rechercher un client"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher par nom ou téléphone"
                    sx={{ mb: 2 }}
                />
            </Box>
            
            <Box display="flex" justifyContent="flex-end" mb={2}>
                {/* Bouton FAB positionné au-dessus de la barre de recherche */}
                <Fab color="primary" aria-label="add" onClick={handleClickOpen} style={{ marginRight: 16 }}>
                    <AddIcon />
                </Fab>
            </Box>

            <Box display="flex" flexDirection="column">
                <CustomerTable 
                    customers={filteredCustomers} 
                    onEdit={handleEdit} 
                    onDelete={handleDeleteConfirm} 
                    onViewOrders={handleViewOrders} 
                />
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <CustomerForm onSave={handleSave} onClose={handleClose} customer={selectedCustomer} />
                </DialogContent>
            </Dialog>

            <Dialog open={confirmDelete} onClose={handleCancelDelete}>
                <DialogContent>
                    <Typography variant="h6">
                        Êtes-vous sûr de vouloir supprimer ce client ?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={handleDelete} color="secondary">
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>

            {successMessage && (
                <Typography color="primary" sx={{ mt: 2 }}>
                    {successMessage}
                </Typography>
            )}
        </Container>
    );
};

export default CustomerPage;

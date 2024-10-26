import React, { useState, useEffect } from 'react';
import DelivererForm from './DelivererForm';
import DelivererTable from './DelivererTable';
import { Container, Typography, Box, Fab, Dialog, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { getDeliverers, createDeliverer, updateDeliverer, deleteDeliverer } from '../../api/delivererApi';

const DelivererPage = () => {
    const [deliverers, setDeliverers] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedDeliverer, setSelectedDeliverer] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [delivererToDelete, setDelivererToDelete] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // État pour le terme de recherche
    const navigate = useNavigate();

    useEffect(() => {
        fetchDeliverers();
    }, []);

    const fetchDeliverers = async () => {
        try {
            const data = await getDeliverers();
            setDeliverers(data);
        } catch (error) {
            console.error('Error fetching deliverers:', error);
        }
    };

    const handleClickOpen = () => {
        setSelectedDeliverer(null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSuccessMessage('');
    };

    const handleSave = async (delivererData) => {
        try {
            if (selectedDeliverer) {
                await updateDeliverer(selectedDeliverer.deliveryId, delivererData);
                setSuccessMessage('Livreur modifié avec succès !');
            } else {
                await createDeliverer(delivererData);
                setSuccessMessage('Livreur ajouté avec succès !');
            }
            fetchDeliverers();
            handleClose();
        } catch (error) {
            console.error('Error saving deliverer:', error);
        }
    };

    const handleEdit = (deliverer) => {
        setSelectedDeliverer(deliverer);
        setOpen(true);
    };

    const handleDeleteConfirm = (delivererId) => {
        setDelivererToDelete(delivererId);
        setConfirmDelete(true);
    };

    const handleDelete = async () => {
        // Demande de confirmation avant de supprimer
        const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer ce livreur ?');
        
        if (confirmed) {
            try {
                await deleteDeliverer(delivererToDelete);
                setSuccessMessage('Livreur supprimé avec succès !');
                fetchDeliverers();
                setConfirmDelete(false);
            } catch (error) {
                console.error('Error deleting deliverer:', error);
            }
        } else {
            console.log('Suppression annulée');
        }
    };
    
    const handleCancelDelete = () => {
        setConfirmDelete(false);
    };

    const handleViewOrders = (delivererId) => {
        navigate(`/order-list?delivererId=${delivererId}`); 
    };

    const filteredDeliverers = deliverers.filter(deliverer => {
        const nameMatch = deliverer.deliveryPersName && deliverer.deliveryPersName.toLowerCase().includes(searchTerm.toLowerCase());
        const phoneMatch = deliverer.deliveryPersPhone && deliverer.deliveryPersPhone.startsWith(searchTerm);
        console.log(`Name Match: ${nameMatch}, Phone Match: ${phoneMatch}`); 
        return nameMatch || phoneMatch;
    });

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Livreurs
            </Typography>

            <Box mb={2}>
                {/* Barre de recherche */}
                <TextField
                    label="Rechercher un livreur"
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
                {/* Bouton FAB pour ajouter un livreur */}
                <Fab color="primary" aria-label="add" onClick={handleClickOpen} style={{ marginRight: 16 }}>
                    <AddIcon />
                </Fab>
            </Box>

            <Box display="flex" flexDirection="column">
                <DelivererTable 
                    deliverers={filteredDeliverers} 
                    onEdit={handleEdit} 
                    onDelete={handleDeleteConfirm} 
                    onViewOrders={handleViewOrders} 
                />
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <DelivererForm onSave={handleSave} onClose={handleClose} deliverer={selectedDeliverer} />
                </DialogContent>
            </Dialog>

            <Dialog open={confirmDelete} onClose={handleCancelDelete}>
                <DialogContent>
                    <Typography variant="h6">
                        Êtes-vous sûr de vouloir supprimer ce livreur ?
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

export default DelivererPage;

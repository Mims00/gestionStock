import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
    Card, 
    CardContent,
    Typography,
    Box, 
    Button, 
    TextField, 
    Select, 
    MenuItem,
    InputLabel, 
    FormControl,  
    Dialog,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    DialogActions 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import PrintIcon from '@mui/icons-material/Print';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';

const OrderCard = ({orderId}) => {
    const [order, setOrder] = useState([]);
    const [orders, setOrders] = useState([]);
    const [status, setStatus] = useState('');
    const [orderDate, setOrderDate] = useState('');
    const [isCancelling, setIsCancelling] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isPrinted, setIsPrinted] = useState(false); // État pour suivre si la facture a été imprimée
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showOrderForm, setShowOrderForm] = useState(false);


    // Récupération des commandes depuis l'API
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/orders');
                setOrders(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des commandes:', error);
            }
        };

        fetchOrders();
    }, []);
    useEffect(() => {
      if (selectedOrder) {
          console.log(selectedOrder); // Vérifiez ici si les données sont correctes
      }
  }, [selectedOrder]);
 // Récupérer les détails de la commande à partir de l'API
 useEffect(() => {
  const fetchOrderDetail = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:3000/api/orders/${orderId}`);
      console.log('Réponse complète de l\'API :', response.data); // Log l'objet complet
      console.log('Détails de la commande :', response.data.orderDetails);
      setOrder(response.data);

    } catch (error) {
      console.error('Erreur lors de la récupération de la commande:', error);
      // Gérer l'erreur ici, par exemple afficher un message à l'utilisateur
    } finally {
      setIsLoading(false);
    }
  };

  if (orderId) {
    fetchOrderDetail();
  }
}, [orderId]);
    // Filtrer les commandes en fonction de l'état et de la date
    const filteredOrders = orders.filter(order => {
        const matchesStatus = status ? order.status === status : true;
        const matchesDate = orderDate ? order.orderDate === orderDate : true;
        return matchesStatus && matchesDate;
    });


    const handleDeleteOrder = async (orderId) => {
    // Demander une confirmation avant la suppression
    const confirmation = window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?');
    
    if (confirmation) {
        try {
            // Envoyer une requête de suppression à l'API
            await axios.delete(`http://localhost:3000/api/orders/${orderId}`);
            
            // Mettre à jour la liste des commandes localement après la suppression
            setOrders((prevOrders) => prevOrders.filter(order => order.orderId !== orderId));
            
            console.log(`Commande avec ID ${orderId} supprimée avec succès.`);
        } catch (error) {
            console.error('Erreur lors de la suppression de la commande :', error);
            alert('Erreur lors de la suppression de la commande. Veuillez réessayer.');
        }
    }
};

const handleUpdate = (orderId) => {
  const orderToUpdate = orders.find(order => order.orderId === orderId);

  if (orderToUpdate) {
    // Pre-populate the order form with selected order data
    setShowOrderForm(true);
    // Implement logic to pass selectedOrder data to your order form component
    // (e.g., using context, Redux, or other state management techniques)
  }
};

const handleValidateOrder = (orderId) => {
  setSelectedOrderId(orderId); // Stocker l'ID de la commande sélectionnée pour la validation après impression
  setOpenDialog(true); // Ouvrir le dialogue
};
const handlePrint = async () => {
  window.print(); // Lancer l'impression
  setIsPrinted(true); // Marquer comme imprimée
  console.log('ID de commande à valider:', selectedOrderId);

  try {
    // Valider la commande après impression
    const response = await axios.patch(`http://localhost:3000/api/orders/${selectedOrderId}/validate`);
    console.log('Réponse de validation de commande:', response.data); 
    setSelectedOrder(response.data.order); // Mettre à jour l'état de la commande en "Validée"
  } catch (error) {
    console.error('Erreur lors de la validation de la commande après impression:', error);
  }

  setOpenDialog(false); // Fermer le dialogue après impression
};

// handleReturn : Fermer simplement le dialogue sans changer l'état
const handleReturn = () => {
  setOpenDialog(false); // Fermer le dialogue sans modifier l'état de la commande
};

//annulation e commande
const handleCancelOrder = async (orderId) => {
    if (!orderId || isNaN(orderId)) {
        console.error('ID de commande invalide', orderId);
        return;
    }

    // Demande de confirmation avant d'annuler la commande
    const confirmed = window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?');

    if (!confirmed) {
        console.log('Annulation de commande annulée');
        return; // Si l'utilisateur annule, on sort de la fonction
    }
    
    setIsCancelling(true);
    try {
        await axios.patch(`http://localhost:3000/api/orders/${orderId}/cancel`);
        setIsCancelling(false);
        // Mettez à jour l'état ou rechargez les commandes ici si nécessaire
    } catch (error) {
        setIsCancelling(false);
        console.error('Erreur lors de l\'annulation de la commande:', error);
    }
};


   
    // Gestion de la fermeture du dialogue
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setIsPrinted(false); // Réinitialiser l'état d'impression à la fermeture du dialogue
    };

    return (
        <Box sx={{ paddingX: 3 }}>
            <Box mb={2} mt={4} display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center">
                    <FormControl variant="outlined" size="small" sx={{ width: '150px', marginRight: '16px' }}>
                        <InputLabel>État</InputLabel>
                        <Select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            label="État"
                        >
                            <MenuItem value="">
                                <em>Tous</em>
                            </MenuItem>
                            <MenuItem value="annulée">Annulée</MenuItem>
                            <MenuItem value="validée">Validée</MenuItem>
                            <MenuItem value="En attente">En attente</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        type="date"
                        variant="outlined"
                        size="small"
                        sx={{ width: '150px', marginLeft: '16px' }} 
                        value={orderDate}
                        onChange={(e) => setOrderDate(e.target.value)}
                    />
                </Box>

                <Button 
                    component={RouterLink} 
                    to="/order-form" 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddIcon />}
                    sx={{ marginRight: 2 }}
                >
                    Nouvelle Commande
                </Button>
            </Box>

            <Box 
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '16px', // Espacement entre les cartes
                }}
            >
                {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                        <Card key={order.id} sx={{ width: 300, boxShadow: 3, borderRadius: 2 }}>
                            <CardContent sx={{ padding: 2 }}>
                                <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 'bold', mb: 1 }}>
                                    Commande n°: {order.orderId}
                                </Typography>
                                <Typography sx={{ fontSize: 14 }}>Date: {order.orderDate}</Typography>
                                <Typography sx={{ fontSize: 14 }}>Client: {order.Customer?.customerName}</Typography>
                                <Typography sx={{ fontSize: 14 }}>Adresse: {order.Customer?.address}</Typography>
                                <Typography sx={{ fontSize: 14 }}>Téléphone: {order.Customer?.phoneNumber}</Typography>
                                <Typography sx={{ fontSize: 14 }}>Mode de livraison: {order.deliveryMethod}</Typography>
                                <Typography sx={{ fontSize: 14 }}>Mode de paiement: {order.paymentMethod}</Typography>
                                <Typography sx={{ fontSize: 14 }}>Livreur: {order.DeliveryPerson?.deliveryPersName}</Typography>
                                <Typography sx={{ fontSize: 14 }}>Contact livreur: {order.DeliveryPerson?.deliveryPersPhone}</Typography>
                                <Typography sx={{ fontSize: 14 }}>Adresse de livraison: {order.DeliveryPerson?.deliveryAddress}</Typography>
                                <Typography sx={{ fontSize: 14 }}>État: {order.status}</Typography>
                                <Typography sx={{ fontSize: 14, mb: 2 }}>Total: {order.finalAmount}</Typography>

                                <Box mt={2} display="flex" justifyContent="space-between">
                                    {order.status === 'En attente' && (
                                        <>
                                            <Button 
                                                component={RouterLink} 
                                                to="/order-form"
                                                variant="contained" 
                                                color="primary" 
                                                sx={{ fontSize: 10, padding: '4px 8px', marginX: 1 }}
                                                onClick={() => handleUpdate(order.orderId)}
                                                startIcon={<EditIcon />}
                                            >
                                                
                                            </Button>
                                            <Button 
                                                onClick={() => handleValidateOrder(order.orderId)}
                                                variant="contained" 
                                                color="success" 
                                                sx={{ fontSize: 10, padding: '4px 8px', marginX: 1 }}
                                                startIcon={<CheckIcon />}
                                            >
                                               
                                            </Button>
                                            <Button 
                                                variant="contained" 
                                                color="error" 
                                                sx={{ fontSize: 10, padding: '4px 8px', marginX: 1 }}
                                                startIcon={<CancelIcon />}
                                                onClick={() => handleCancelOrder(order.orderId)} 
                                                disabled={isCancelling}
                                            >
                                                {isCancelling ? 'Annulation...' : 'Annuler'}
                                            </Button>
                                        </>
                                    )}
                                    {(order.status === 'annulée' || order.status === 'validée') && (
                                        <Button 
                                            onClick={() => handleDeleteOrder(order.orderId)} 
                                            variant="contained" 
                                            color="error" 
                                            sx={{ fontSize: 10, padding: '4px 8px', marginX: 1 }}
                                            startIcon={<DeleteIcon />}
                                        >
                                           
                                        </Button>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Typography variant="body1" color="textSecondary">
                        Aucune commande trouvée.
                    </Typography>
                )}
            </Box>

            {/* Dialogue d'affichage des lignes de commande */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Facture de la Commande n°{selectedOrder?.orderId} </DialogTitle>
                <DialogContent>
  <Typography variant="h6">Détails de la commande</Typography>

  <Typography><strong>Numéro de commande :</strong> {selectedOrder?.orderId}</Typography>
  <Typography><strong>Date de la commande :</strong> {new Date().toLocaleDateString()}</Typography>

  <Typography><strong>ID Client :</strong> {selectedOrder?.Customer?.customerId}</Typography>
  <Typography><strong>Client :</strong> {selectedOrder?.Customer?.customerName}</Typography>
  <Typography><strong>Adresse :</strong> {selectedOrder?.Customer?.address}</Typography>
  <Typography><strong>Contact:</strong> {selectedOrder?.Customer?.phoneNumber}</Typography>
  
                
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Produit</TableCell>
                                <TableCell>Quantité</TableCell>
                                <TableCell>Prix unitaire</TableCell>
                                <TableCell>Prix total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {selectedOrder?.orderLine?.map((item) => (
                                <TableRow key={item.orderLineId}>
                                    <TableCell>{item.Product.productName}</TableCell> {/* Utilisez item.Product pour accéder au produit */}
                                    <TableCell>{item.qty}</TableCell>
                                    <TableCell>{item.unitPrice} Ar</TableCell>
                                    <TableCell>{(item.qty * item.unitPrice).toFixed(2)} Ar</TableCell> {/* Calcul du prix total */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                      <Typography><strong>Livraison :</strong> {selectedOrder?.deliveryMethod}</Typography>
                      <Typography><strong>Nom du livreur :</strong> {selectedOrder?.DeliveryPerson?.deliveryPersName}</Typography>
                      <Typography><strong>Adresse de livraison :</strong> {selectedOrder?.deliveryAddress}</Typography>
                      <Typography><strong>Frais de livraison :</strong> {selectedOrder?.deliveryCost} Ar</Typography>
                      <Typography><strong>Paiement :</strong> {selectedOrder?.paymentMethod}</Typography>
                      <Typography><strong>Total :</strong> {selectedOrder?.finalAmount} Ar</Typography>
                      <Typography sx={{ mt: 2 }}>Merci pour votre commande !</Typography>
              </DialogContent>
                <DialogActions>
                    <Button onClick={handlePrint} startIcon={<PrintIcon />}>Imprimer</Button>
                    <Button onClick={handleCloseDialog}>Fermer</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default OrderCard;

import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    IconButton,
    Grid,
    Snackbar,
    Alert,
    Select,
    MenuItem,
    OutlinedInput,
    InputLabel
} from '@mui/material';
import { Link as RouterLink ,useLocation,useNavigate} from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SaveIcon from '@mui/icons-material/Save';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';


const ProductTable = ({ onProductSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/api/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des produits', error);
            });
    }, []);

    const filteredProducts = products.filter(product =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>Liste des Produits Disponibles</Typography>
            <TextField
                label="Rechercher un produit"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ marginBottom: 2 }}
            />
            {filteredProducts.map(product => (
                <Box key={product.productId} display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 1 }}>
                    <Typography>{product.productName} - {parseFloat(product.price).toFixed(2)} Ar</Typography>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => onProductSelect(product)}
                        startIcon={<ShoppingCartIcon />}
                    >
                    </Button>
                </Box>
            ))}
            {filteredProducts.length === 0 && (
                <Typography variant="body1">Aucun produit trouvé.</Typography>
            )}
        </Box>
    );
}

const OrderForm = ({ existingOrder, onSubmit }) => {
    const navigate=useNavigate();
    const location = useLocation();
    const { handleValidateOrder, order } = location.state || {}; 
    const [customers, setCustomers] = useState([]);
    const [deliverers, setDeliverers] = useState([]);
    const [customerInfo, setCustomerInfo] = useState({
        customerName: existingOrder?.customerInfo?.customerName || '', 
        address: existingOrder?.customerInfo?.address || '', 
        phoneNumber: existingOrder?.customerInfo?.phoneNumber || ''
    });

    const [selectedProducts, setSelectedProducts] = useState(existingOrder?.products || []);
    const [deliveryMethod, setDeliveryMethod] = useState(existingOrder?.deliveryMethod || 'précupération');
    const [paymentMethod, setPaymentMethod] = useState(existingOrder?.paymentMethod || '');
    const [deliveryInfo, setDeliveryInfo] = useState({
        deliveryPersName: existingOrder?.deliveryInfo?.deliveryPersName || '',
        deliveryPersPhone: existingOrder?.deliveryInfo?.deliveryPersPhone || '',
        deliveryCost: existingOrder?.deliveryInfo?.deliveryCost || '',
        deliveryAddress: existingOrder?.deliveryInfo?.deliveryAddress || ''
    });
    const [totalAmount, setTotalAmount] = useState(existingOrder?.totalAmount || 0);
    const [discount, setDiscount] = useState(existingOrder?.discount || 0);
    const [finalAmount, setFinalAmount] = useState(existingOrder?.finalAmount || 0);



    useEffect(() => {
        const updateTotalAmount = () => {
            const total = selectedProducts.reduce(
                (total, item) => total + item.product.price * item.qty, 
                0
            );
            setTotalAmount(total);
        };
        updateTotalAmount();
    }, [selectedProducts]);
    
    // Calcul du montant final avec la remise et les frais de livraison
    useEffect(() => {
        const calculateFinalAmount = () => {
            const discountAmount = (discount / 100) * totalAmount;
            let deliveryCost = deliveryMethod === 'livraison' ? parseFloat(deliveryInfo.deliveryCost) || 0 : 0; 
            setFinalAmount(totalAmount - discountAmount + deliveryCost); 
        };
        calculateFinalAmount();
    }, [totalAmount, discount, deliveryMethod, deliveryInfo.deliveryCost]);
    useEffect(() => {
        axios.get('http://localhost:3000/api/deliverers')
            .then(response => setDeliverers(response.data))
            .catch(error => console.error('Erreur lors de la récupération des livreurs', error));
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3000/api/customers')
            .then(response => setCustomers(response.data))
            .catch(error => console.error('Erreur lors de la récupération des clients', error));
    }, []);

    const handleCustomerChange = (event) => {
        const selectedCustomer = customers.find(customer => customer.customerName === event.target.value);
        setCustomerInfo({
            customerName: selectedCustomer.customerName,
            address: selectedCustomer.address,
            phoneNumber: selectedCustomer.phoneNumber
        });
    };

    const handleDelivererChange = (event) => {
        const selectedDeliverer = deliverers.find(deliverer => deliverer.deliveryPersName === event.target.value);
        if (!selectedDeliverer) {
            console.error('Livreur non trouvé. Veuillez vérifier le nom du livreur.');
            return;  // Ne pas continuer si le livreur est introuvable
        }
        setDeliveryInfo({
            ...deliveryInfo,
            deliveryPersName: event.target.value,
            deliveryPersPhone: selectedDeliverer ? selectedDeliverer.deliveryPersPhone : ''
        });
    };

    const handleProductSelect = (product) => {
        const existingProduct = selectedProducts.find(item => item.product.productId === product.productId);
        
        if (existingProduct) {
            // Incrémenter la quantité si le produit est déjà sélectionné
            setSelectedProducts(selectedProducts.map(item => 
                item.product.productId === product.productId 
                    ? { ...item, qty: item.qty + 1 } 
                    : item
            ));
        } else {
            // Ajouter le produit s'il n'est pas encore sélectionné
            setSelectedProducts([...selectedProducts, { product, qty: 1 }]);
        }
    };
    const handleQuantityChange = (index, qty) => {
        const quantityValue = parseInt(qty, 10); // Correction : conversion en entier
        
        if (quantityValue < 1) return; // Si la quantité est inférieure à 1, arrêter
    
        const updatedProducts = [...selectedProducts];
        updatedProducts[index].qty = quantityValue; // Utiliser `qty` pour stocker la quantité
        setSelectedProducts(updatedProducts);
    };
    

    const handleRemoveProduct = (index) => {
        const updatedProducts = selectedProducts.filter((_, i) => i !== index);
        setSelectedProducts(updatedProducts);
    };

    const handleSubmit = () => {
        const selectedCustomer = customers.find(cust => cust.customerName === customerInfo.customerName);
        const selectedDeliverer = deliverers.find(del => del.deliveryPersName === deliveryInfo.deliveryPersName);
        
        // Vérifier les stocks des produits sélectionnés
        for (let item of selectedProducts) {
            if (item.qty > item.product.stock) {
                alert(`Stock insuffisant pour le produit ${item.product.productName}. Quantité en stock: ${item.product.stock}`);
                return;
            }
        }
        
        // Préparer les données de la commande
        const orderData = {
            customerId: selectedCustomer ? selectedCustomer.customerId : undefined, 
            customerAddress: customerInfo.address,
            customerPhone: customerInfo.phoneNumber,
            products: selectedProducts.map(item => ({
                productId: item.product.productId,
                qty: item.qty,
                price: item.product.price
            })),
            totalAmount,
            discount,
            finalAmount,
            deliveryMethod,
            deliveryInfo: deliveryMethod === 'livraison' ? {
                deliveryPersId: selectedDeliverer ? selectedDeliverer.deliveryPersId : undefined,
                deliveryCost: deliveryInfo.deliveryCost || 0,
                deliveryAddress: deliveryInfo.deliveryAddress || "",
                deliveryPersName: deliveryInfo.deliveryPersName,
                deliveryPersPhone: deliveryInfo.deliveryPersPhone
            } : undefined,
            paymentMethod
        };
        
        if (!orderData.customerId) {
            console.error('Customer ID is undefined. Please ensure a customer is selected.');
            return;
        }
        
        // Déterminer s'il s'agit d'une création ou d'une modification
        if (existingOrder) {
            // Mise à jour de la commande existante avec `PUT` ou `PATCH`
            axios.put(`http://localhost:3000/api/orders/${existingOrder.orderId}`, orderData)
                .then(response => {
                    console.log('Order updated successfully:', response.data);
                    alert('Commande mise à jour avec succès.');
                   
                })
                
                .catch(error => {
                    console.error('Error updating order:', error);
                    alert('Erreur lors de la mise à jour de la commande. Veuillez réessayer.');
                });
        } else {
            // Création d'une nouvelle commande
            console.log(orderData);
            
            axios.post('http://localhost:3000/api/orders', orderData)
                .then(response => {
                    console.log('Order created successfully:', response.data);
                    alert('Commande créée avec succès.');
                    navigate('/order-list')
                   
                })
                .catch(error => {
                    console.error('Error creating order:', error);
                    alert('Erreur lors de la création de la commande. Veuillez réessayer.');
                });
        }
    };
    const handleSubmitAndValidate = async () => {
        try {
            const newOrder = await handleSubmit(); // Enregistrer la commande et obtenir l'objet complet de la commande
    
            if (newOrder && newOrder.orderId) {
                handleValidateOrder(newOrder.orderId); // Valider la commande après l'enregistrement
            } else {
                console.error("L'ID de la commande n'existe pas");
            }
        } catch (error) {
            console.error("Erreur lors de la validation et de l'enregistrement de la commande :", error);
        }
    };
    


    
    return (
        <Box sx={{ padding: 2, maxWidth: 1200, margin: '0 auto' }}>
            <Typography variant="h5" sx={{ marginBottom: 5,textAlign:'center' }}>Créer une Commande</Typography>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Box sx={{ marginBottom: 2 }}>
                        <FormControl fullWidth sx={{ marginBottom: 2 }}>
                            <InputLabel>Nom du Client</InputLabel>
                            <Select
                                value={customerInfo.customerName}
                                onChange={handleCustomerChange}
                                input={<OutlinedInput label="Nom du Client" />}
                            >
                                {customers.map(customer => (
                                    <MenuItem key={customer.id} value={customer.customerName}>
                                        {customer.customerName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField 
                            label="Adresse" 
                            fullWidth 
                            value={customerInfo.address} 
                            sx={{ marginBottom: 1 }}
                            readOnly
                        />
                        <TextField 
                            label="Téléphone" 
                            fullWidth 
                            value={customerInfo.phoneNumber} 
                            readOnly
                        />
                    </Box>

                    <ProductTable onProductSelect={handleProductSelect} />

                    <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>Produits Sélectionnés</Typography>
                            {selectedProducts.map((item, index) => (
    <Box key={index} display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 1 }}>
        <Typography>{item.product.productName} - {parseFloat(item.product.price).toFixed(2)} Ar</Typography> {/* Modification ici */}
        <TextField 
            label="Quantité" 
            type="number" 
            value={item.qty} 
            onChange={(e) => handleQuantityChange(index, e.target.value)} 
            sx={{ width: 100, marginRight: 1 }} 
        />
                                <IconButton color="error" onClick={() => handleRemoveProduct(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                </Grid>

                <Grid item xs={6}>
                    <TextField 
                        label="Montant Total" 
                        fullWidth 
                        value={totalAmount.toFixed(2)} 
                        readOnly 
                        sx={{ marginBottom: 2 }} 
                    />

                    <TextField 
                        label="Réduction (%)" 
                        type="number" 
                        fullWidth 
                        value={discount} 
                        onChange={(e) => setDiscount(e.target.value)} 
                        sx={{ marginBottom: 2 }} 
                    />

                    <TextField 
                        label="Montant Final" 
                        fullWidth 
                        value={finalAmount.toFixed(2)} 
                        readOnly 
                        sx={{ marginBottom: 2 }} 
                    />

                    <Box sx={{ marginBottom: 2 }}>
                        <FormControl fullWidth>
                            <FormLabel>Mode de Livraison</FormLabel>
                            <RadioGroup value={deliveryMethod} onChange={(e) => setDeliveryMethod(e.target.value)}>
                                <FormControlLabel value="récupération" control={<Radio />} label="Récupération" />
                                <FormControlLabel value="livraison" control={<Radio />} label="Livraison" />
                            </RadioGroup>
                        </FormControl>
                    </Box>

                    {deliveryMethod === 'livraison' && (
                        <Box sx={{ marginBottom: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel>Nom du livreur</InputLabel>
                                <Select
                                    value={deliveryInfo.deliveryPersName}
                                    onChange={handleDelivererChange}
                                    input={<OutlinedInput label="Nom du livreur" />}
                                    sx={{ marginBottom: 1 }} 
                                >
                                    {deliverers.map(deliverer => (
                                        <MenuItem key={deliverer.deliveryPersId} value={deliverer.deliveryPersName}>
                                            {deliverer.deliveryPersName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField 
                                label="Téléphone du Livreur" 
                                fullWidth 
                                value={deliveryInfo.deliveryPersPhone} 
                                readOnly 
                                sx={{ marginBottom: 1 }} 
                            />
                            <TextField 
                                label="Frais de Livraison" 
                                type="number" 
                                fullWidth 
                                value={deliveryInfo.deliveryCost} 
                                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, deliveryCost: e.target.value })} 
                                sx={{ marginBottom: 1 }}
                            />
                            <TextField 
                                label="Adresse de Livraison" 
                                fullWidth 
                                value={deliveryInfo.deliveryAddress} 
                                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, deliveryAddress: e.target.value })} 
                            />
                        </Box>
                    )}

                    <Box sx={{ marginBottom: 2 }}>
                        <FormControl fullWidth>
                            <FormLabel>Type de Paiement</FormLabel>
                            <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                <FormControlLabel value="cash" control={<Radio />} label="Espèces" />
                                <FormControlLabel value="credit" control={<Radio />} label="mobile money" />
                            </RadioGroup>
                        </FormControl>
                    </Box>

                    <Box display="flex" alignItems="right" sx={{ position: 'fixed', bottom: 16, left: 'auto', right: 16 }}>
    <Button component={RouterLink} to="/order-list" variant="contained" color="primary" size="small" sx={{ marginRight: 1 }}
    startIcon={<ListAltIcon fontSize="small" />}>
        Liste des Commandes
    </Button>
    <Button
        variant="contained"
        color="primary" 
        size="small"
        sx={{ marginRight: 1 }}
        startIcon={<SaveIcon fontSize="small" />}
        onClick={handleSubmit}
    >
        Enregistrer
    </Button>
    <Button variant="contained" color="success" size="small"
     onClick={handleSubmitAndValidate} 
    startIcon={<CheckCircleIcon fontSize="small" />}>
        Valider la Commande
    </Button>
</Box>

                </Grid>
            </Grid>
        </Box>
    );
}

export default OrderForm;

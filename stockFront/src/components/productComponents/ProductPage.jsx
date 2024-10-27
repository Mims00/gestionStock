import React, { useState, useEffect } from 'react';
import ProductForm from './ProductForm';
import ProductTable from './ProductTable';
import { Container, Typography, Box, Fab, Dialog, DialogContent, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api/productApi';
import Swal from 'sweetalert2';

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleClickOpen = () => {
        setSelectedProduct(null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async (productData) => {
        try {
            if (selectedProduct) {
                await updateProduct(selectedProduct.productId, productData);
            } else {
                await createProduct(productData);
            }
            fetchProducts();
            handleClose();
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setOpen(true);
    };

    const handleDelete = async (productId) => {
        // Demande de confirmation avant de supprimer
        const result = await Swal.fire({
            title: 'Êtes-vous sûr de vouloir supprimer ce produit ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Supprimer',
            cancelButtonText: 'Annuler'
        });
    
        if (result.isConfirmed) {
            try {
                await deleteProduct(productId); // Suppression du produit
                fetchProducts(); // Rafraîchir la liste des produits
                Swal.fire('Supprimé!', 'Le produit a été supprimé avec succès.', 'success'); // Message de succès
            } catch (error) {
                console.error('Erreur lors de la suppression du produit:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: 'Une erreur est survenue lors de la suppression du produit.',
                });
            }
        } else {
            console.log('Suppression annulée');
        }
    };
    

    // Filtrer les produits en fonction du terme de recherche
    const filteredProducts = products.filter(product =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (searchTerm && Math.floor(product.productId / 10) * 10 === parseInt(searchTerm, 10))
    );

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Produits
            </Typography>

            <Box mb={2}>
                {/* Barre de recherche */}
                <TextField
                    label="Rechercher un produit"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher par nom ou ID"
                    sx={{ mb: 2 }}
                />
            </Box>

            <Box mb={2} display="flex" flexDirection="column">
                <Fab
                    color="primary"
                    aria-label="add"
                    onClick={handleClickOpen}
                    sx={{
                        position: 'relative',
                        alignSelf: 'flex-end',
                        mb: 2
                    }}
                >
                    <AddIcon />
                </Fab>

                {/* Affichage direct des résultats dans le tableau */}
                <ProductTable products={filteredProducts} onEdit={handleEdit} onDelete={handleDelete} />
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <ProductForm onSave={handleSave} onClose={handleClose} product={selectedProduct} />
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default ProductPage;

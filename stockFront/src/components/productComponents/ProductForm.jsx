import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, DialogActions, Paper, Typography } from '@mui/material';

const ProductForm = ({ onSave, onClose, product }) => {
    const [productName, setName] = useState('');
    const [descri, setDescri] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [stockMin, setStockMin] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (product) {
            setName(product.productName);
            setDescri(product.descri);
            setPrice(product.price);
            setStock(product.stock);
            setStockMin(product.stockMin);
        }
    }, [product]);

    const handleNumericInput = (value) => {
        return /^(\d*\.?\d+|\d+\.?\d*)$/.test(value);
    };

    const validateForm = () => {
        if (!productName || !price || !stock || !stockMin) {
            setErrorMessage('Tous les champs sont obligatoires.');
            return false;
        }
        if (!handleNumericInput(price) || !handleNumericInput(stock) || !handleNumericInput(stockMin)) {
            setErrorMessage("Les champs 'Prix', 'Stock', et 'Stock Minimum' doivent contenir uniquement des nombres.");
            return false;
        }
        setErrorMessage('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const productData = { productName, descri, price, stock, stockMin };
        console.log('Submitting product data:', productData); 

        try {
            await onSave(productData);
            setSuccessMessage('Produit enregistré avec succès !');
            setErrorMessage(''); 
            onClose();
        } catch (error) {
            setErrorMessage(`Échec de l'enregistrement du produit: ${error.message}`);
            setSuccessMessage(''); 
            console.error("Failed to save product", error);
        }
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <Paper elevation={3} sx={{ padding: 2, width: 400 }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Nom"
                    variant="outlined"
                    value={productName}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    required
                />
                <TextField
                    label="Description"
                    variant="outlined"
                    value={descri}
                    onChange={(e) => setDescri(e.target.value)}
                    fullWidth
                   
                />
                <TextField
                    label="Prix"
                    variant="outlined"
                    value={price}
                    onChange={(e) => {
                        if (handleNumericInput(e.target.value) || e.target.value === '') {
                            setPrice(e.target.value);
                        }
                    }}
                    fullWidth
                    required
                    type="number"
                    inputProps={{ step: '0.01' }} // Pour les valeurs décimales
                    error={!handleNumericInput(price) && price !== ''}
                    helperText={!handleNumericInput(price) && price !== '' ? 'Veuillez entrer un nombre valide.' : ''}
                />
                <TextField
                    label="Stock"
                    type="number"
                    variant="outlined"
                    value={stock}
                    onChange={(e) => {
                        if (handleNumericInput(e.target.value) || e.target.value === '') {
                            setStock(e.target.value);
                        }
                    }}
                    fullWidth
                    required
                    inputProps={{ step: '0.01' }} // Pour les valeurs décimales
                    error={!handleNumericInput(stock) && stock !== ''}
                    helperText={!handleNumericInput(stock) && stock !== '' ? 'Veuillez entrer un nombre valide.' : ''}
                />
                <TextField
                    label="Stock Minimum"
                    type="number"
                    variant="outlined"
                    value={stockMin}
                    onChange={(e) => {
                        if (handleNumericInput(e.target.value) || e.target.value === '') {
                            setStockMin(e.target.value);
                        }
                    }}
                    fullWidth
                    required
                    inputProps={{ step: '0.01' }} // Pour les valeurs décimales
                    error={!handleNumericInput(stockMin) && stockMin !== ''}
                    helperText={!handleNumericInput(stockMin) && stockMin !== '' ? 'Veuillez entrer un nombre valide.' : ''}
                />

                {errorMessage && (
                    <Typography color="error" sx={{ marginTop: 1 }}>
                        {errorMessage}
                    </Typography>
                )}

                {successMessage && (
                    <Typography color="primary" sx={{ marginTop: 1 }}>
                        {successMessage}
                    </Typography>
                )}

                <DialogActions sx={{ marginTop: 2 }}>
                    <Button type="submit" color="primary" variant="contained">
                        Enregistrer
                    </Button>
                    <Button onClick={handleCancel} color="secondary" variant="outlined">
                        Annuler
                    </Button>
                </DialogActions>
            </Box>
        </Paper>
    );
};

export default ProductForm;

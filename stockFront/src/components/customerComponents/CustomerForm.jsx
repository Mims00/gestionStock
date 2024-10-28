import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

const CustomerForm = ({ onSave, onClose, customer }) => {
    const [formState, setFormState] = useState({
        customerName: '',
        address: '',
        phoneNumber: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (customer) {
            setFormState({
                customerName: customer.customerName,
                address: customer.address,
                phoneNumber: customer.phoneNumber
            });
        }
    }, [customer]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState({ ...formState, [name]: value });
    };

    const validateForm = () => {
        const { customerName, phoneNumber } = formState;
        if (customerName && /\d/.test(customerName)) {
            return false;
        }
        if (phoneNumber && (!/^\d{10}$/.test(phoneNumber))) {
            return false;
        }
        setErrorMessage('');
        return true;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSave(formState);
            setSuccessMessage(customer ? 'Client modifié avec succès !' : 'Client ajouté avec succès !');
            setErrorMessage('');
        }
    };

    return (
        <Box p={3} width="500px">
            <Typography variant="h6" gutterBottom>
                {customer ? 'Modifier Client' : 'Ajouter Client'}
            </Typography>
            <TextField
                label="Nom"
                name="customerName"
                value={formState.customerName}
                onChange={handleChange}
                fullWidth
                margin="normal"
                helperText={errorMessage && /Le nom ne doit pas contenir de chiffres./.test(errorMessage) ? errorMessage : ''}
             
            />
            <TextField
                label="Adresse"
                name="address"
                value={formState.address}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Téléphone"
                name="phoneNumber"
                value={formState.phoneNumber}
                onChange={handleChange}
                fullWidth
                margin="normal"
                helperText={errorMessage && /Le téléphone doit contenir 10 chiffres./.test(errorMessage) ? errorMessage : ''}
               
            />
            {errorMessage && (
                <Typography color="error" sx={{ mt: 2 }}>
                    {errorMessage}
                </Typography>
            )}
            {successMessage && (
                <Typography color="primary" sx={{ mt: 2 }}>
                    {successMessage}
                </Typography>
            )}
            <Box mt={2} display="flex" justifyContent="flex-end">
               
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Enregistrer
                </Button>
                <Button variant="outlined" color="secondary" onClick={onClose} sx={{ ml: 2 }}>
                    Annuler
                </Button>
            </Box>
        </Box>
    );
};

export default CustomerForm;

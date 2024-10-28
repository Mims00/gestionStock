import React, { useState, useEffect } from 'react';
import { TextField, Button, Box } from '@mui/material';

const DelivererForm = ({ onDelivererAdded, onCancel, initialData }) => {
    const [deliveryPersName, setName] = useState(initialData?.deliveryPersName || '');
    const [deliveryPersPhone, setPhone] = useState(initialData?.deliveryPersPhone || '');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setName(initialData.deliveryPersName );
            setPhone(initialData.deliveryPersPhone);
        }
    }, [initialData]);

    const validateForm = () => {
        const newErrors = {};
        if (!deliveryPersName) newErrors.deliveryPersName= 'Le nom est obligatoire';
        if (!deliveryPersPhone) {
            newErrors.deliveryPersPhone = 'Le téléphone est obligatoire';
        } else if (!/^\d{10}$/.test(deliveryPersPhone)) {
            newErrors.deliveryPersPhone = 'Le téléphone doit comporter 10 chiffres';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onDelivererAdded({ deliveryPersName, deliveryPersPhone });
        }
    };

    return (
        <Box 
            component="form" 
            onSubmit={handleSubmit} 
            display="flex" 
            flexDirection="column" 
            gap={2} 
            width="400px" 
        >
            <TextField
                label="Nom"
                value={deliveryPersName}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                fullWidth
                required
            />
            
            <TextField
                label="Téléphone"
                value={deliveryPersPhone}
                onChange={(e) => setPhone(e.target.value)}
                error={!!errors.deliveryPersPhone}
                fullWidth
                required
            />
            <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button onClick={onCancel} color="secondary">Annuler</Button>
                <Button type="submit" variant="contained" color="primary">
                    {initialData ? 'Enregistrer' : 'Enregistrer'}
                </Button>
            </Box>
        </Box>
    );
};

export default DelivererForm;

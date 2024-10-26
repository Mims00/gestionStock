import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Grid, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const UserForm = ({ user, onSave, onCancel }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
            setRole(user.role || '');
            setPhone(user.phone || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleSubmit = () => {
        const userData = { firstName, lastName, role, phone, email };
        onSave(userData); 
    };
    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
            setRole(user.role || '');
            setPhone(user.phone || '');
            setEmail(user.email || '');
        } else {
            // Réinitialise les champs si aucun utilisateur n'est sélectionné
            setFirstName('');
            setLastName('');
            setRole('');
            setPhone('');
            setEmail('');
        }
    }, [user]);
    

    return (
        <Box padding={2} > 
        <Grid container spacing={3} direction="column">
            <Grid item xs={12}>
                <TextField 
                    label="Nom" 
                    fullWidth 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                    sx={{ width: '100%' }} 
                />
            </Grid>
            <Grid item xs={12}>
                <TextField 
                    label="Prénom" 
                    fullWidth 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                    sx={{ width: '100%' }} 
                />
            </Grid>
            <Grid item xs={12}>
                <FormControl fullWidth sx={{ width: '100%' }}> {/* Largeur du champ */}
                    <InputLabel>Rôle</InputLabel>
                    <Select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        label="Rôle"
                        sx={{ width: '100%' }} 
                    >
                        <MenuItem value="ADMIN">Admin</MenuItem>
                        <MenuItem value="VENDEUR">Vendeur</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <TextField 
                    label="Téléphone" 
                    fullWidth 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    sx={{ width: '100%' }} 
                />
            </Grid>
            <Grid item xs={12}>
                <TextField 
                    label="Email" 
                    fullWidth 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    sx={{ width: '100%' }} 
                />
            </Grid>
        </Grid>
        <Box mt={3} sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ width: '48%' }}>
                Save
            </Button>
            <Button variant="outlined" color="secondary" onClick={onCancel} sx={{ width: '48%' }}>
                Cancel
            </Button>
        </Box>
    </Box>
    

    );
};

export default UserForm;

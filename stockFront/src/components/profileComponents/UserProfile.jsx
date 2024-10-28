import React, { useState } from 'react';
import { Container, Card, CardContent, CardActions, Avatar, Button, TextField, IconButton, Tabs, Tab, Box } from '@mui/material';
import { Edit, Save, ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const [editMode, setEditMode] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const navigate = useNavigate()

    const handleEditToggle = () => {
        setEditMode(!editMode);
    };

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };


    const deconnexion =()=>
    {

        localStorage.removeItem("token-gs")
        navigate("/login")
    }

    return (
        <Container maxWidth="sm">
            <Card sx={{ mt: 4, padding: 2 }}>
    <Box display="flex" alignItems="center" flexDirection="column" p={1}> {/* Réduire padding ici */}
        <Avatar sx={{ width: 60, height: 60 }}>M</Avatar> {/* Réduire la taille de l'avatar */}
        <h2 style={{ margin: '8px 0' }}>Miora</h2> {/* Réduire la marge */}
    </Box>
    <Tabs value={tabIndex} onChange={handleTabChange} centered sx={{ minHeight: '36px' }}> {/* Réduire la hauteur des tabs */}
        <Tab label="Informations" sx={{ minHeight: '36px' }} />
        <Tab label="Sécurité" sx={{ minHeight: '36px' }} />
    </Tabs>
    {tabIndex === 0 && (
        <CardContent sx={{ padding: '8px' }}> {/* Réduire le padding */}
            <TextField
                label="Nom d'utilisateur"
                fullWidth
                variant="outlined"
                margin="dense" 
                defaultValue="Miora"
                InputProps={{ readOnly: !editMode }}
            />
            <TextField
                label="Email"
                fullWidth
                variant="outlined"
                margin="dense"
                defaultValue="maminiainamioratiana@gmail.com"
                InputProps={{ readOnly: !editMode }}
            />
            <TextField
                label="Téléphone"
                fullWidth
                variant="outlined"
                margin="dense"
                defaultValue="+2563426598"
                InputProps={{ readOnly: !editMode }}
            />
            <TextField
                label="Rôle"
                fullWidth
                variant="outlined"
                margin="dense"
                defaultValue="Admin"
                disabled
            />
        </CardContent>
    )}
    {tabIndex === 1 && (
        <CardContent sx={{ padding: '8px' }}> {/* Réduire le padding */}
            <TextField
                label="Mot de passe actuel"
                fullWidth
                variant="outlined"
                margin="dense"
                type="password"
                InputProps={{ readOnly: !editMode }}
            />
            <TextField
                label="Nouveau mot de passe"
                fullWidth
                variant="outlined"
                margin="dense"
                type="password"
                InputProps={{ readOnly: !editMode }}
            />
            <TextField
                label="Confirmer mot de passe"
                fullWidth
                variant="outlined"
                margin="dense"
                type="password"
                InputProps={{ readOnly: !editMode }}
            />
        </CardContent>
    )}
    <CardActions sx={{ padding: '8px' }}> {/* Réduire padding */}
        <IconButton color="primary" onClick={handleEditToggle}>
            {editMode ? <Save /> : <Edit />}
        </IconButton>
        <Button variant="contained" color="error" onClick={()=>deconnexion()} startIcon={<ExitToApp />}>
            Se Déconnecter
        </Button>
    </CardActions>
</Card>

        </Container>
    );
};

export default UserProfile;

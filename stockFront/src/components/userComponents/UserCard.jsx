import React from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIcon from '@mui/icons-material/Assignment';

const UserCard = ({ user, onEdit, onDelete, onViewOrders }) => {
    console.log('UserCard received user:', user);
    return (
        <Card sx={{ marginBottom: '16px', padding: '16px', boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h6">{user.username}</Typography>
                <Typography>Nom: {user.firstName}</Typography>
                <Typography>Prénom: {user.lastName}</Typography>
                <Typography>Email: {user.email}</Typography>
                <Typography>Téléphone: {user.phone}</Typography>
                <Typography>Rôle: {user.role}</Typography>
                <Typography>Mot de passe: {user.password}</Typography> 
                <Box mt={2} display="flex" justifyContent="space-between">
                    <IconButton color="primary" onClick={onEdit}>
                        <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={onViewOrders}>
                        <AssignmentIcon />
                    </IconButton>
                    <IconButton color="error" onClick={onDelete}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    );
};

export default UserCard;

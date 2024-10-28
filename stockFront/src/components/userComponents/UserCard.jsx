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
            <Typography><strong>Nom:</strong> {user.firstName}</Typography>
            <Typography><strong>Prénom:</strong> {user.lastName}</Typography>
            <Typography><strong>Email:</strong> {user.email}</Typography>
            <Typography><strong>Téléphone:</strong> {user.phone}</Typography>
            <Typography><strong>Rôle:</strong> {user.role}</Typography>
            <Typography><strong>Mot de passe:</strong> {user.password}</Typography>

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

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogActions, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Swal from 'sweetalert2'
const DelivererTable = ({ deliverers, onEdit, onDelete, onViewOrders }) => {

    const handleDelete = async (delivererId) => {
        // Demander la confirmation de suppression avec SweetAlert
        const result = await Swal.fire({
            title: 'Êtes-vous sûr de vouloir supprimer ce livreur ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Supprimer',
            cancelButtonText: 'Annuler'
        });

        if (result.isConfirmed) {
            // Appeler la fonction de suppression
            try {
                await onDelete(delivererId); // Assurez-vous que onDelete est une fonction async
                Swal.fire('Supprimé!', 'Le livreur a été supprimé avec succès.', 'success');
            } catch (error) {
                console.error('Erreur lors de la suppression du livreur:', error);
                Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression.', 'error');
            }
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell 
                            style={{
                                backgroundColor: '#0a192f', // Couleur d'arrière-plan de l'en-tête
                                color: '#fff' // Couleur du texte
                            }}
                        >
                            ID
                        </TableCell>
                        <TableCell 
                            style={{
                                backgroundColor: '#0a192f', 
                                color: '#fff'
                            }}
                        >
                            Nom
                        </TableCell>
                        <TableCell 
                            style={{
                                backgroundColor: '#0a192f', 
                                color: '#fff'
                            }}
                        >
                            Téléphone
                        </TableCell>
                        <TableCell 
                            style={{
                                backgroundColor: '#0a192f', 
                                color: '#fff'
                            }} 
                            align="right"
                        >
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {deliverers.map((deliverer) => (
                        <TableRow key={deliverer.deliveryPersId}>
                            <TableCell style={{ borderBottom: '1px solid #ccc' }}>{deliverer.deliveryPersId}</TableCell>
                            <TableCell style={{ borderBottom: '1px solid #ccc' }}>{deliverer.deliveryPersName}</TableCell>
                            <TableCell style={{ borderBottom: '1px solid #ccc' }}>{deliverer.deliveryPersPhone}</TableCell>
                            <TableCell style={{ borderBottom: '1px solid #ccc' }} align="right">
                                <IconButton onClick={() => onViewOrders(deliverer.id)}><AssignmentIcon /></IconButton>
                                <IconButton onClick={() => onEdit(deliverer)}><EditIcon /></IconButton>
                                <IconButton onClick={() => handleDelete(deliverer.deliveryPersId)}><DeleteIcon /></IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DelivererTable;
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogActions, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIcon from '@mui/icons-material/Assignment';

const DelivererTable = ({ deliverers, onEdit, onDelete, onViewOrders }) => {
    const [openConfirm, setOpenConfirm] = useState(false);
    const [selectedDelivererId, setSelectedDelivererId] = useState(null);

    const handleOpenConfirm = (id) => {
        setSelectedDelivererId(id);
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
        setSelectedDelivererId(null);
    };

    const handleConfirmDelete = () => {
        onDelete(selectedDelivererId);
        handleCloseConfirm();
    };

    return (
        <>
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
                                    <IconButton onClick={() => handleOpenConfirm(deliverer.id)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={openConfirm}
                onClose={handleCloseConfirm}
            >

                <DialogActions>
                    <Button onClick={handleCloseConfirm} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={handleConfirmDelete} color="secondary">
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DelivererTable;

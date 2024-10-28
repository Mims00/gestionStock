import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ListAltIcon from '@mui/icons-material/ListAlt'; 

const CustomerTable = ({ customers, onEdit, onDelete, onViewOrders }) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell 
                            style={{
                                backgroundColor: '#0a192f', 
                                color: '#fff' 
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
                            Adresse
                        </TableCell>
                        <TableCell 
                            style={{
                                backgroundColor: '#0a192f', 
                                color: '#fff'
                            }}
                        >
                            Téléphone
                        </TableCell>
                        <TableCell align="right" 
                            style={{
                                backgroundColor: '#0a192f', 
                                color: '#fff'
                            }}
                        >
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {customers.map((customer) => (
                        <TableRow key={customer.customerId}>
                            <TableCell style={{ borderBottom: '1px solid #ccc' }}>{customer.customerId}</TableCell>
                            <TableCell style={{ borderBottom: '1px solid #ccc' }}>{customer.customerName}</TableCell>
                            <TableCell style={{ borderBottom: '1px solid #ccc' }}>{customer.address}</TableCell>
                            <TableCell style={{ borderBottom: '1px solid #ccc' }}>{customer.phoneNumber}</TableCell>
                            <TableCell align="right" style={{ borderBottom: '1px solid #ccc' }}>
                                <IconButton onClick={() => onViewOrders(customer.customerId)}>
                                    <ListAltIcon />
                                </IconButton>
                                <IconButton onClick={() => onEdit(customer)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => onDelete(customer.customerId)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CustomerTable;

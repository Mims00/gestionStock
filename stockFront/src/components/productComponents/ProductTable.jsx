import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ProductTable = ({ products, onEdit, onDelete }) => {
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
                                color: '#fff',
                                padding: '4px 8px'
                            }}
                        >
                            Nom du Produit
                        </TableCell>
                        <TableCell 
                            style={{
                                backgroundColor: '#0a192f', 
                                color: '#fff',
                                padding: '4px 8px'
                            }}
                        >
                            Description
                        </TableCell>
                        <TableCell 
                            style={{
                                backgroundColor: '#0a192f', 
                                color: '#fff',
                                padding: '4px 8px'
                            }}
                        >
                            Prix
                        </TableCell>
                        <TableCell 
                            style={{
                                backgroundColor: '#0a192f', 
                                color: '#fff',
                                padding: '4px 8px'
                            }}
                        >
                            Stock
                        </TableCell>
                        <TableCell 
                            style={{
                                backgroundColor: '#0a192f', 
                                color: '#fff',
                                padding: '4px 8px'
                            }}
                        >
                            Stock Minimum
                        </TableCell>
                        <TableCell 
                            style={{
                                backgroundColor: '#0a192f', 
                                color: '#fff',
                                padding: '4px 8px'
                            }}
                        >
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.productId}>
                            <TableCell style={{ borderBottom: '1px solid #ccc'}}>{product.productId}</TableCell>
                            <TableCell style={{ borderBottom: '1px solid #ccc' }}>{product.productName}</TableCell>
                            <TableCell style={{borderBottom: '1px solid #ccc'}}>{product.descri}</TableCell>
                            <TableCell style={{ borderBottom: '1px solid #ccc' }}>{product.price}</TableCell>
                            <TableCell style={{borderBottom: '1px solid #ccc' }}>{product.stock}</TableCell>
                            <TableCell style={{borderBottom: '1px solid #ccc' }}>{product.stockMin}</TableCell>
                            <TableCell style={{ borderBottom: '1px solid #ccc' }} align="right">
                                <IconButton onClick={() => onEdit(product)}><EditIcon /></IconButton>
                                <IconButton onClick={() => onDelete(product.productId)}><DeleteIcon /></IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ProductTable;

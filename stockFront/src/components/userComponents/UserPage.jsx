import React, { useState, useEffect } from 'react';
import { Container, Box, Grid, Dialog, DialogContent, Fab, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UserForm from './UserForm';
import UserCard from './UserCard';
import { addUser, updateUser, getUsers ,deleteUser} from '../../api/userApi';
import Swal from 'sweetalert2';

const UserPage = () => {
    const [users, setUsers] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState(''); // Ajout du filtre de rôle
    const [filteredUsers, setFilteredUsers] = useState([]);

    // Charger les utilisateurs au montage du composant
  
        const fetchUsers = async () => {
            try {
                const data = await getUsers();
                console.log('Fetched users:', data);  
                if (Array.isArray(data)) {
                    setUsers(data);
                    setFilteredUsers(data);
                } else {
                    console.error('Data format is incorrect:', data);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        useEffect(() => {
            fetchUsers(); 
        }, []); 
        useEffect(() => {
            // Si les utilisateurs sont mis à jour, rafraîchir la liste
            setFilteredUsers(users);
        }, [users]);
        
    
    
    // Filtrer les utilisateurs selon la recherche et le rôle
    useEffect(() => {
        let filtered = users;

        if (searchQuery.trim() !== '') {
            const lowercasedQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(user => 
                user.firstName.toLowerCase().includes(lowercasedQuery) || 
                user.lastName.toLowerCase().includes(lowercasedQuery)
            );
        }

        if (roleFilter) {
            filtered = filtered.filter(user => user.role === roleFilter);
        }

        setFilteredUsers(filtered);
    }, [searchQuery, roleFilter, users]);

    // Ajouter un utilisateur
    const handleUserAdded = async (newUser) => {
        try {
            const addedUser = await addUser(newUser);
            setUsers([...users, addedUser]);
            setIsFormOpen(false);
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };
    const handleDelete = async (userId) => {
        // Demande de confirmation avant de supprimer avec SweetAlert
        const result = await Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: 'Vous ne pourrez pas revenir en arrière !',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Annuler'
        });
    
        if (result.isConfirmed) {
            try {
                await deleteUser(userId); // Appel à l'API pour supprimer l'utilisateur
                // Mise à jour de la liste des utilisateurs après la suppression
                setUsers((prevUsers) => prevUsers.filter((user) => user.userId !== userId));
                Swal.fire('Supprimé !', 'L\'utilisateur a été supprimé.', 'success');
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'utilisateur :', error);
                Swal.fire('Erreur', 'Il y a eu une erreur lors de la suppression de l\'utilisateur.', 'error');
            }
        } else {
            console.log('Suppression annulée');
        }
    };
    
    // Éditer un utilisateur
    const handleUserEdit = async (userId) => {
        const userToEdit = users.find(user => user.userId === userId);
        setSelectedUser(userToEdit);
        setIsFormOpen(true);
    };

   // Mettre à jour un utilisateur
   const handleUserUpdate = async (updatedUser) => {
    if (selectedUser && selectedUser.userId) {
        try {
            // Appel API pour mettre à jour l'utilisateur
            const updatedUserData = await updateUser(selectedUser.userId, updatedUser);

            // Met à jour localement la liste des utilisateurs
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.userId === selectedUser.userId ? updatedUserData : user
                )
            );

            // Réinitialise selectedUser
            setSelectedUser(null);

            // Fermer le Dialog
            setIsFormOpen(false); 

        } catch (error) {
            console.error('Error updating user:', error);
        }
    }
};

    // Visualiser les commandes d'un utilisateur (fonctionnalité à développer)
    const handleUserViewOrders = (userId) => {
        console.log(`View orders for user with ID: ${userId}`);
    };

    return (
        <Container>
            <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
                <TextField
                    label="Rechercher un utilisateur"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ width: '50%' }} // Réduire la taille de la barre de recherche
                />

                {/* Filtre par rôle */}
                <FormControl variant="outlined" sx={{ width: '25%', marginLeft: '1rem' }}>
                    <InputLabel>Filtrer par rôle</InputLabel>
                    <Select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        label="Filtrer par rôle"
                    >
                        <MenuItem value="">Tous</MenuItem>
                        <MenuItem value="ADMIN">Admin</MenuItem>
                        <MenuItem value="VENDEUR">Vendeur</MenuItem>
                    </Select>
                </FormControl>

                {/* Bouton flottant pour ajouter un utilisateur */}
                <Fab color="primary" aria-label="add" sx={{ marginLeft: '1rem' }} onClick={() => setIsFormOpen(true)}>
                    <AddIcon />
                </Fab>
            </Box>

            {/* Liste des utilisateurs */}
            <Grid container spacing={2}>
    {filteredUsers.length > 0 ? (
        filteredUsers.map(user => (
            <Grid item xs={12} sm={6} md={4} key={user.userId}>
                <UserCard 
                    user={user} 
                    onEdit={() => handleUserEdit(user.userId)} 
                    onViewOrders={() => handleUserViewOrders(user.userId)} 
                    onDelete={() => handleDelete(user.userId)} 
                />
            </Grid>
        ))
    ) : (
        <p>Aucun utilisateur trouvé</p>
    )}
</Grid>

{/* Dialog pour le formulaire utilisateur */}
<Dialog 
    open={isFormOpen} 
    onClose={() => setIsFormOpen(false)} 
    maxWidth="sm"  // Réduction de la taille à "sm" (small)
    fullWidth 
    scroll="body" 
>
    <DialogContent sx={{ width: '100%', maxWidth: '500px', padding: '16px' }}>
        <UserForm
            user={selectedUser}
            onSave={selectedUser ? handleUserUpdate : handleUserAdded}
            onCancel={() => {
                setIsFormOpen(false);
                setSelectedUser(null);
            }}
        />
    </DialogContent>
</Dialog>


        </Container>
    );
};

export default UserPage;


import { AppBar, Toolbar, Tabs, Tab, IconButton, Badge } from '@mui/material';
import { Notifications, AccountCircle } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';  
import axios from 'axios';

const Navbar = () => {

  const [notifications, setNotifications] = useState([]);

  // Fonction pour récupérer les notifications depuis l'API
  const fetchNotifications = async () => {
      try {
          const response = await axios.get('http://localhost:3000/api/notifications');
          setNotifications(response.data);
      } catch (error) {
          console.error('Erreur lors de la récupération des notifications :', error);
      }
  };

  useEffect(() => {
      fetchNotifications();
  }, []);

  // Filtrer pour obtenir le nombre de notifications non lues
  const unreadNotificationsCount = notifications.filter(notification => notification.statusNotif === 'non-lu').length;
  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#003366',zIndex: (theme) => theme.zIndex.drawer + 1 ,top: 0, zIndex: 1000 }}> {/* Changer la couleur ici */}
      <Toolbar>
        <Tabs textColor="inherit" value={0}>
          <Tab label="Accueil" component={Link} to="/" />
          <Tab label="Prédiction" component={Link} to="/prediction" />
          <Tab label="Produit" component={Link} to="/product" />
          <Tab label="Client" component={Link} to="/customer" />
          <Tab label="Livreur" component={Link} to="/deliverer" />
          <Tab label="Commande" component={Link} to="/order-list" />
          <Tab label="Utilisateur" component={Link} to="/user" />
        </Tabs>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
        <IconButton component={Link} to="/notification" color='white'>
                <Badge badgeContent={unreadNotificationsCount} color="error">
                    <Notifications />
                </Badge>
            </IconButton>
          <IconButton color="inherit" component={Link} to="/profile">
            <AccountCircle />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Badge, IconButton, Card, CardContent, Divider, Typography, Box } from '@mui/material';
import { Notifications,  Warning,CheckCircle, Person } from '@mui/icons-material';


const NotificationPage = () => {
    const [notifications, setNotifications] = useState([]);

    // Fonction pour récupérer les notifications depuis l'API
    const fetchNotifications = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/notifications'); // Remplacez par votre URL API réelle
            setNotifications(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des notifications :', error);
        }
    };

    useEffect(() => {
        // Appel de la fonction pour charger les notifications lors du montage du composant
        fetchNotifications();
    }, []);

    return (
        <Card sx={{ mt: 4 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>Notifications</Typography>
                <List>
                    {notifications.length === 0 ? (
                        <Typography variant="body2" color="textSecondary">Aucune notification disponible</Typography>
                    ) : (
                        notifications.map((notification, index) => {
                            // Définir la couleur et l'icône en fonction du type de notification
                            let icon, iconColor, textColor;

                            if (notification.type === 'Stock') {
                                icon = <Warning sx={{ color: 'red' }} />; // Couleur rouge pour Stock
                                textColor = 'error.main'; 
                            } else if (notification.type === 'Validation') {
                                icon = <CheckCircle sx={{ color: 'green' }} />; // Couleur verte pour Validation
                                textColor = 'success.main';
                            } else if (notification.type === 'Création compte') {
                                icon = <Person sx={{ color: 'blue' }} />; // Couleur bleue pour Création compte
                                textColor = 'primary.main'; 
                            }

                            return (
                                <React.Fragment key={notification.notificationId}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemText
                                            primary={notification.content}
                                            secondary={
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography variant="caption" color="textSecondary">
                                                        {new Date(notification.date).toLocaleDateString()}
                                                    </Typography>
                                                </Box>
                                            }
                                            primaryTypographyProps={{
                                                variant: 'body1',
                                                sx: { color: textColor }, // Applique la couleur en fonction du type de notification
                                            }}
                                        />
                                        <IconButton>
                                            {icon}
                                        </IconButton>
                                    </ListItem>
                                    {index < notifications.length - 1 && <Divider variant="middle" />}
                                </React.Fragment>
                            );
                        })
                    )}
                </List>
            </CardContent>
        </Card>
    );
};

export default NotificationPage;

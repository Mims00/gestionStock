const { Notification } = require('../models');


// Créer une notification
exports.createNotification = async (req, res) => {
  const { type, content, relatedEntityId, relatedEntityType } = req.body;

  try {
    const notification = await Notification.create({
      type,
      content,
      relatedEntityId,
      relatedEntityType,
      date: new Date(),
      statusNotif: 'non-lu',
    });

    res.status(201).json({ message: 'Notification créée avec succès', notification });
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error);
    res.status(500).json({ message: 'Erreur lors de la création de la notification' });
  }
};

// Récupérer toutes les notifications
exports.getAllNotifications = async (req, res) => {
    try {
      const notifications = await Notification.findAll();
      console.log('Notifications récupérées:', notifications);
      if (notifications.length === 0) {
        return res.status(404).json({ message: 'Aucune notification trouvée' });
      }
      res.status(200).json(notifications);
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des notifications' });
    }
  };
  

// Marquer une notification comme lue
exports.markAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification non trouvée' });
    }

    notification.statusNotif = 'lu';
    await notification.save();

    res.status(200).json({ message: 'Notification marquée comme lue', notification });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la notification:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la notification' });
  }
};

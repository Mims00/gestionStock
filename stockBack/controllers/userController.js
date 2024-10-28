const bcrypt = require('bcrypt');
const User = require('../models'); // Assurez-vous que le modèle est bien importé

const addUser = async (req, res) => {
  try {
    // Récupérer les données du corps de la requête
    const { data } = req.body;

    // Vérification que les données obligatoires sont présentes
    if (!data ) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Création de l'utilisateur en utilisant l'objet data
    const user = await User.create(data);

    // Réponse avec l'utilisateur créé
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user.' });
  }
};


// Ajouter nom d'utilisateur et mot de passe
const addCredentials = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    user.username = username;
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt); 
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating credentials:', error);
    res.status(500).json({ error: 'Error updating credentials.' });
  }
};

// Mettre à jour un utilisateur
const updateUser = async (req, res) => {
  const { userId } = req.params;
  const updatedUser = req.body;

  try {
    const [updatedRows, [user]] = await User.update(updatedUser, {
      where: { id: userId }, // Assurez-vous que la colonne `id` correspond bien à l'ID de l'utilisateur
      returning: true, // Cela retournera le nouvel utilisateur mis à jour
    });

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error });
  }
};

// Supprimer un utilisateur
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    await user.destroy();

    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user.' });
  }
};

// Obtenir tous les utilisateurs
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Error retrieving users.' });
  }
};

// Obtenir un utilisateur par ID
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ error: 'Error retrieving user.' });
  }
};

module.exports = { addCredentials, addUser, getUserById, getUsers, deleteUser, updateUser };

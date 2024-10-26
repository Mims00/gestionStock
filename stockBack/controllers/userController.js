const { User } = require('../models');

// Ajouter un utilisateur (sans nom d'utilisateur et mot de passe)
exports.addUser = async (req, res) => {
    try {
      const { firstName, lastName, role, phone, email } = req.body;
      
      // Vérification que les données obligatoires sont présentes
      if (!firstName || !lastName || !role || !phone ) {
        return res.status(400).json({ error: 'All fields are required.' });
      }
  
      const user = await User.create({ firstName, lastName, role, phone, email });
      res.status(201).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Error creating user.' });
    }
  };
  

// Ajouter nom d'utilisateur et mot de passe
exports.addCredentials = async (req, res) => {
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
      res.status(500).json({ error: 'Error updating credentials.' });
    }
  };

  exports.updateUser = async (req, res) => {
    const userId = req.params.userId;
    const updatedUser = req.body;

    try {
        const [updatedRows, [user]] = await User.update(updatedUser, {
            where: { userId: userId },
            returning: true, // Cela retournera le nouvel utilisateur mis à jour
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};




// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    
    await user.destroy();
    
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user.' });
  }
};

// Obtenir tous les utilisateurs
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving users.' });
  }
};

// Obtenir un utilisateur par ID
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving user.' });
  }
};

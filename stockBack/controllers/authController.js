const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assure-toi que le modèle User est bien exporté
require('dotenv').config(); // Utilise dotenv pour gérer les variables d'environnement

exports.login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    console.log('Requête de connexion reçue:', req.body);

    // Recherche par email ou numéro de téléphone

    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { phone: identifier }
        ]
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Comparaison du mot de passe haché avec le mot de passe fourni
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // Création du token JWT
    const token = jwt.sign(
      { userId: user.userId, email: user.email, phone: user.phone, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
    console.log('Connexion réussie pour l\'utilisateur:', user.email);
    return res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: { id: user.userId, email: user.email, phone: user.phone, role: user.role },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur du serveur', error });
  }
};

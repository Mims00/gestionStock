
// const jwt = require('jsonwebtoken');
// const User = require('../models/user');

// exports.authenticateToken = (req, res, next) => {
//     const token = req.header('Authorization')?.split(' ')[1];
//     if (!token) return res.status(401).json({ message: 'Accès non autorisé' });

//     jwt.verify(token, 'your_jwt_secret', async (err, user) => {
//         if (err) return res.status(403).json({ message: 'Token invalide' });

//         req.user = await User.findByPk(user.id); 
//         next();
//     });
// };

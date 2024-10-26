const express = require('express');
const router = express.Router();
const {addUser,addCredentials,updateUser,deleteUser,getUsers,getUserById} = require('../controllers/userController');

// Routes pour gérer les utilisateurs
router.post('/',addUser);
router.put('/credentials', addCredentials);
router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser);
router.get('/', getUsers);
router.get('/:userId', getUserById);

module.exports = router;

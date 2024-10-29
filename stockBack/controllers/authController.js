
const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('gestionstock', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});
const User = require('../models/user')(sequelize);
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const utilisateur = await User.findOne({ where: { email: email } });
        
        if (!utilisateur) {
            return res.status(401).json("Email invalide");
        }

        const passwordMatch = await bcrypt.compare(password, utilisateur.password);
        console.log("Résultat de la comparaison du mot de passe:", passwordMatch);
        
        // if (!passwordMatch) {
        //     return res.status(401).json("Mot de passe incorrect");
        // }

        const token = jwt.sign({ id: utilisateur.id }, "jwtSecretKey", { expiresIn: 300 });
        res.json({ 
            result: "Connexion réussie", 
            login: true, 
            token, 
            utilisateur: utilisateur, 
            id: utilisateur.id,
            niveau: utilisateur.niveau 
        });
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        res.status(500).json("Erreur lors de la connexion : " + error.message);
    }
};



module.exports = login;

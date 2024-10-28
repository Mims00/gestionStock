
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const User = require("../models/user")




const login=async(req,res)=>
  {
      const { email, password } = req.body;
      try {
          const utilisateur = await User.findOne({ email });
          const id = utilisateur.id;
          if (!utilisateur)
          {
              return res.status(401).json("Email invalide");
          }
          const passwordMatch = await bcrypt.compare(password, utilisateur.password);
          if (!passwordMatch) {
              return res.status(401).json("Email ou mot de passe invalide");
          }
          const token = jwt.sign({ id: utilisateur._id }, "jwtSecretKey", { expiresIn: 300 });
          res.json({ result: "Connexion réussie", login: true, token, utilisateur,id });
      } catch (error) {
          res.status(500).json("Erreur lors de la connexion : " + error.message);
      }
  }
  


  module.exports =login
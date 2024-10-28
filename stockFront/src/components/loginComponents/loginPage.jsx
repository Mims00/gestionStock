import React, { useState } from 'react'; 
import { Box, Button, TextField, Typography, Container, InputAdornment } from '@mui/material';
import { Person, Lock } from '@mui/icons-material';
import { Link, useNavigate  } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState(''); // Utilisé pour l'email ou le téléphone
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate(); // Initialiser navigate

  const handleLogin = async () => {
    try {
      // Envoi de l'identifiant (email ou téléphone) et du mot de passe
      const response = await axios.post('http://localhost:3000/api/auth', { identifier, password });
      // Stocker le token JWT dans le localStorage
      localStorage.setItem('token', response.data.token);
      console.log('Connexion réussie:', response.data);

      // Rediriger vers la page d'accueil
      navigate('/'); // Redirection vers la page d'accueil ou toute autre route
    }  catch (error) {
      if (error.response && error.response.status === 401) {
          setError('Mot de passe incorrect');
      } else if (error.response && error.response.status === 404) {
          setError('Utilisateur non trouvé');
      } else {
          setError('Une erreur est survenue. Veuillez réessayer.');
      }
  }
  };

  return (
    <Container
      sx={{
        height: '100vh', 
        width: '100vw',  
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        margin: 0,
        marginLeft: '5%',  // Added margin to move the container slightly to the right
      }}
    >
      <Box
        sx={{
          width: '70%',
          height: '60%', 
          display: 'flex', 
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)', 
          borderRadius: 3,
          backgroundColor: '#fff',
        }}
      >
        {/* Left Section: Login Form */}
        <Box
          sx={{
            width: '50%', // Half of the width for the login form
            padding: 4,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#003366' }}>
            Connexion
          </Typography>

          <form>
            <TextField
              fullWidth
              label="Email ou Numéro de téléphone"
              margin="normal"
              variant="outlined"
              value={identifier} // Met à jour l'identifier avec email ou phone
              onChange={(e) => setIdentifier(e.target.value)} // Gestion du changement
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Mot de passe"
              type="password"
              margin="normal"
              variant="outlined"
              value={password} // Met à jour le mot de passe
              onChange={(e) => setPassword(e.target.value)} // Gestion du changement
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                marginTop: 3,
                backgroundColor: '#003366', // Navy blue background for the button
                color: '#fff', // White text
                '&:hover': { backgroundColor: '#002244' }, // Darker navy on hover
              }}
              onClick={handleLogin}
            >
              Se connecter
            </Button>
          </form>

          <Typography variant="body2" sx={{ marginTop: 2 }}>
            Vous n'avez pas de compte ?{' '}
            <Link to="/register" style={{ textDecoration: 'none', color: '#003366' }}>
              Inscrivez-vous
            </Link>
          </Typography>
        </Box>

        {/* Right Section: Slogan */}
        <Box
          sx={{
            width: '50%', // Half of the width for the slogan section
            backgroundColor: '#003366', // Navy blue background
            color: '#fff', // White text for readability
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '0px 3px 3px 0px', // Rounded only on the right
            padding: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          "Dites adieu aux erreurs et aux ruptures de stock. Notre solution 
          vous offre une visibilité complète sur votre inventaire pour une gestion optimisée."
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;

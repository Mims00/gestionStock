import React, { useState } from 'react'; 
import { Box, Button, TextField, Typography, Container, InputAdornment } from '@mui/material';
import { Person, Lock } from '@mui/icons-material';
import { Link, useNavigate  } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const [input,setInput] = useState([])

  const change = (e) => {
    const { name, value } = e.target;
    setInput(values => ({ ...values, [name]: value }));
  }

  const submit = async (e) => {
    e.preventDefault();
    try {
      console.log(input); // Vérifiez que les données sont correctes
      const response = await axios.post("http://localhost:3000/api/auth", input);
      console.log(response.data);

      if(response.data.login)
      {
        localStorage.setItem("token-gs",response.data.token)
        navigate("/")
      }else
      {
        navigate("/login")
      }
      
    } catch (err) {
      console.error("Erreur lors de l'inscription", err);
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
        marginLeft: '5%',
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

          <form onSubmit={submit}>
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              name='email'
              variant="outlined"

              onChange={change} // Gestion du changement
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
              name='password'
              variant="outlined"
              onChange={change}
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
              type='submit'
              sx={{
                marginTop: 3,
                backgroundColor: '#003366', // Navy blue background for the button
                color: '#fff', // White text
                '&:hover': { backgroundColor: '#002244' }, // Darker navy on hover
              }}
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

import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, InputAdornment } from '@mui/material';
import { Person, Email, Lock } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
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
      await axios.post("http://localhost:3000/api/users/", { data: input });
      navigate("/login");
    } catch (err) {
      console.error("Erreur lors de l'inscription", err);
    }
  };
  

  return (
    <Container
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: 400,
          padding: 4,
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
          borderRadius: 2,
          backgroundColor: 'white',
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ color: '#003366', fontWeight: 'bold' }}>
          Inscription
        </Typography>

        <form onSubmit={submit}>
          <TextField
            fullWidth
            label="Nom d'utilisateur"
            margin="normal"
            name="username"
            onChange={change}
            variant="outlined"
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
            label="Email ou numéro de téléphone"
            margin="normal"
            name="email"
            onChange={change}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            fullWidth
            label="Mot de passe"
            type="password"
            margin="normal"
            name="password"
            onChange={change}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            fullWidth
            label="Confirmer le mot de passe"
            type="password"
            name="password2"
            margin="normal"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              marginTop: 3,
              backgroundColor: '#003366', 
              color: '#fff',
              '&:hover': { backgroundColor: '#002244' },
            }}
          >
            S'inscrire
          </Button>
        </form>

        <Typography variant="body2" sx={{ marginTop: 2 }}>
          Vous avez déjà un compte ?{' '}
          <Link to="/login" style={{ textDecoration: 'none', color: '#003366' }}>
            Connectez-vous
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default RegisterPage;

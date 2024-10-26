import React from 'react';
import { Box, Button, TextField, Typography, Container, InputAdornment } from '@mui/material';
import { Person, Email, Lock } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <Container
      sx={{
        height: '100vh', // Full viewport height
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      
      }}
    >
      <Box
        sx={{
          width: 400,
          padding: 4,
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)', // Softer shadow for a professional look
          borderRadius: 2,
          backgroundColor: 'white',
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ color: '#003366', fontWeight: 'bold' }}>
          Inscription
        </Typography>

        <form>
          {/* Username Field */}
          <TextField
            fullWidth
            label="Nom d'utilisateur"
            margin="normal"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
          />
          
          {/* Email/Phone Field */}
          <TextField
            fullWidth
            label="Email ou numéro de téléphone"
            margin="normal"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />
          
          {/* Password Field */}
          <TextField
            fullWidth
            label="Mot de passe"
            type="password"
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
          
          {/* Confirm Password Field */}
          <TextField
            fullWidth
            label="Confirmer le mot de passe"
            type="password"
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
          
          {/* Submit Button */}
          <Button
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

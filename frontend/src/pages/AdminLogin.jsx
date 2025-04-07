import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Grid,
  Link,
} from '@mui/material';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const AdminLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  // Clear any existing admin data on component mount
  useEffect(() => {
    localStorage.removeItem('adminToken');
    queryClient.clear();
  }, [queryClient]);

  const loginMutation = useMutation(
    async (data) => {
      try {
        const response = await axios.post('http://localhost:3000/api/v1/admin/signin', data);
        return response.data;
      } catch (error) {
        if (error.response?.data?.error) {
          throw new Error(error.response.data.error);
        }
        throw new Error('Network error occurred. Please try again.');
      }
    },
    {
      onSuccess: (data) => {
        if (data.token) {
          queryClient.clear(); // Clear any existing cached data
          localStorage.setItem('adminToken', data.token);
          navigate('/admin/dashboard');
        } else {
          setError('No token received from server');
        }
      },
      onError: (error) => {
        setError(error.message || 'An error occurred during login');
      },
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await loginMutation.mutateAsync(formData);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Admin Login
          </Typography>
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Admin Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              error={!!error}
              type="email"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={!!error}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loginMutation.isLoading}
            >
              {loginMutation.isLoading ? 'Logging in...' : 'Login as Admin'}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/admin/signup" variant="body2">
                  Don't have an admin account? Sign up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminLogin; 
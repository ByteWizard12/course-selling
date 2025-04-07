import { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Alert,
  Snackbar
} from '@mui/material';
import { useMutation } from 'react-query';
import axios from 'axios';

const CourseCard = ({ course, isAuthenticated, onPurchase, isPurchased }) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const purchaseMutation = useMutation(
    async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please login to purchase courses');

      const response = await axios.post(
        `http://localhost:3000/api/v1/user/courses/${course._id}/purchase`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    {
      onSuccess: (data) => {
        setSnackbarMessage('Course purchased successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        if (onPurchase) onPurchase();
      },
      onError: (error) => {
        setSnackbarMessage(error.response?.data?.error || 'Failed to purchase course');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      },
    }
  );

  const handlePurchase = () => {
    if (!isAuthenticated) {
      setSnackbarMessage('Please login to purchase courses');
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      return;
    }
    purchaseMutation.mutate();
  };

  return (
    <>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="140"
          image={course.imageUrl}
          alt={course.title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="h2">
            {course.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {course.description}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
            <Typography variant="h6" color="primary">
              ${course.price}
            </Typography>
            {isPurchased ? (
              <Button
                variant="contained"
                color="success"
                onClick={() => {/* Add course content viewing logic here */}}
              >
                View Course
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handlePurchase}
                disabled={purchaseMutation.isLoading}
              >
                {purchaseMutation.isLoading ? 'Purchasing...' : 'Purchase'}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CourseCard; 
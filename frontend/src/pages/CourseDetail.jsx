import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useQuery, useMutation } from 'react-query';
import axios from 'axios';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const { data: course, isLoading } = useQuery(['course', id], async () => {
    const response = await axios.get(`http://localhost:3000/api/v1/course/${id}`);
    return response.data.course;
  });

  const purchaseMutation = useMutation(
    async () => {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:3000/api/v1/user/courses/${id}`,
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
      onSuccess: () => {
        navigate('/dashboard');
      },
      onError: (error) => {
        setError(error.response?.data?.error || 'An error occurred during purchase');
      },
    }
  );

  const handlePurchase = () => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    purchaseMutation.mutate();
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!course) {
    return (
      <Container>
        <Typography variant="h5" align="center" sx={{ mt: 4 }}>
          Course not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Course Content */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={course.imageUrl || 'https://source.unsplash.com/random/800x400?course'}
              alt={course.title}
            />
            <CardContent>
              <Typography variant="h4" component="h1" gutterBottom>
                {course.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip
                  label={course.price === 0 ? 'Free' : 'Paid'}
                  color={course.price === 0 ? 'success' : 'primary'}
                />
                <Chip label={`$${course.price}`} variant="outlined" />
              </Box>
              <Typography variant="body1" paragraph>
                {course.description}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                What you'll learn
              </Typography>
              <Typography variant="body1" paragraph>
                {/* Add course learning objectives here */}
                This course will teach you the fundamentals and advanced concepts of the subject.
                You'll gain practical skills and knowledge that you can apply immediately.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Purchase Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Course Price
              </Typography>
              <Typography variant="h4" color="primary" gutterBottom>
                ${course.price}
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handlePurchase}
                disabled={purchaseMutation.isLoading}
                sx={{ mb: 2 }}
              >
                {purchaseMutation.isLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  'Enroll Now'
                )}
              </Button>
              <Typography variant="body2" color="text.secondary">
                This course includes:
              </Typography>
              <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                <Typography component="li" variant="body2">
                  Lifetime access
                </Typography>
                <Typography component="li" variant="body2">
                  Certificate of completion
                </Typography>
                <Typography component="li" variant="body2">
                  30-day money-back guarantee
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CourseDetail; 
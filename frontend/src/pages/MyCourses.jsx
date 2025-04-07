import { Container, Grid, Typography, Box, CircularProgress } from '@mui/material';
import { useQuery } from 'react-query';
import axios from 'axios';
import CourseCard from '../components/CourseCard';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const MyCourses = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const { data, isLoading, error } = useQuery(
    'purchasedCourses',
    async () => {
      const response = await axios.get('http://localhost:3000/api/v1/user/purchases', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    {
      enabled: !!token,
      staleTime: 30000,
    }
  );

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error" variant="h6">
          Error loading your courses: {error.message}
        </Typography>
      </Container>
    );
  }

  if (!data?.coursesData?.length) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Courses
        </Typography>
        <Typography variant="h6" color="text.secondary">
          You haven't purchased any courses yet. Check out our available courses!
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Courses
      </Typography>
      <Grid container spacing={4}>
        {data.coursesData.map((course) => (
          <Grid item key={course._id} xs={12} sm={6} md={4}>
            <CourseCard
              course={course}
              isAuthenticated={true}
              isPurchased={true}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MyCourses; 
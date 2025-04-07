import { Container, Grid, Typography, Box, CircularProgress } from '@mui/material';
import { useQuery } from 'react-query';
import axios from 'axios';
import CourseCard from '../components/CourseCard';

const Courses = () => {
  const { data: courses = [], isLoading, error } = useQuery(
    'courses',
    async () => {
      const response = await axios.get('http://localhost:3000/api/v1/course/preview');
      return response.data.courses;
    },
    {
      staleTime: 60000, // Cache for 1 minute
    }
  );

  const isAuthenticated = !!localStorage.getItem('token');

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
          Error loading courses: {error.message}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Available Courses
      </Typography>
      <Grid container spacing={4}>
        {courses.map((course) => (
          <Grid item key={course._id} xs={12} sm={6} md={4}>
            <CourseCard
              course={course}
              isAuthenticated={isAuthenticated}
              onPurchase={() => {
                // Optionally refetch courses or update UI
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Courses; 
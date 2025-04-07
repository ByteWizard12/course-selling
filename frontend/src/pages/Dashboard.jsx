import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useQuery } from 'react-query';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const { data, isLoading, error } = useQuery(
    'userCourses',
    async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await axios.get('http://localhost:3000/api/v1/user/purchases', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    {
      enabled: !!localStorage.getItem('token'),
      retry: 1,
      onError: (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    }
  );

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error.response?.data?.message || error.message || 'An error occurred while fetching your courses'}
        </Alert>
      </Container>
    );
  }

  // Combine purchases with course data
  const userCourses = data?.purchases.map(purchase => ({
    ...purchase,
    course: data.coursesData.find(course => course._id.toString() === purchase.courseId.toString())
  })) || [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Dashboard
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="My Courses" />
          <Tab label="In Progress" />
          <Tab label="Completed" />
        </Tabs>
      </Box>

      {userCourses.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            You haven't purchased any courses yet
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/courses')}
            sx={{ mt: 2 }}
          >
            Browse Courses
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {userCourses.map((purchase) => (
            <Grid item key={purchase._id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.2s ease-in-out',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={purchase.course?.imageLink || 'https://source.unsplash.com/random/300x200?course'}
                  alt={purchase.course?.title || 'Course'}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {purchase.course?.title || 'Course Title'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {purchase.course?.description || 'No description available'}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Purchased on: {new Date(purchase.createdAt).toLocaleDateString()}
                    </Typography>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => navigate(`/courses/${purchase.courseId}`)}
                    >
                      Continue Learning
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard; 
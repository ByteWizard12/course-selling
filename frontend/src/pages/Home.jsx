import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useQuery } from 'react-query';
import axios from 'axios';
import SchoolIcon from '@mui/icons-material/School';
import DevicesIcon from '@mui/icons-material/Devices';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { School, Computer, Assignment } from '@mui/icons-material';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isAuthenticated = !!(localStorage.getItem('token') || localStorage.getItem('adminToken'));

  const { data: featuredCourses = [], isError, error } = useQuery(
    'featuredCourses',
    async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/course/preview');
        return response.data.courses.slice(0, 3);
      } catch (error) {
        throw error;
      }
    },
    {
      retry: 1,
      onError: (error) => {
        console.error('Error fetching courses:', error);
      }
    }
  );

  const features = [
    {
      icon: <School sx={{ fontSize: 40 }} />,
      title: 'Expert Instructors',
      description: 'Learn from industry professionals and experienced educators.',
    },
    {
      icon: <Computer sx={{ fontSize: 40 }} />,
      title: 'Interactive Learning',
      description: 'Engage with hands-on projects and real-world applications.',
    },
    {
      icon: <Assignment sx={{ fontSize: 40 }} />,
      title: 'Flexible Schedule',
      description: 'Learn at your own pace with lifetime access to course materials.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 4,
            }}
          >
            Transform Your Future with Online Learning
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              mb: 4,
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            Access high-quality courses from expert instructors and advance your career
          </Typography>
          {!isAuthenticated && (
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate('/signup')}
                sx={{ mr: 2 }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                onClick={() => navigate('/courses')}
              >
                Browse Courses
              </Button>
            </Box>
          )}
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 6 }}
        >
          Why Choose LearnHub?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 3,
                }}
                elevation={0}
                variant="outlined"
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h3">
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {!isAuthenticated && (
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/signup')}
            >
              Join Now
            </Button>
          </Box>
        )}
      </Container>

      {/* Featured Courses Section */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{ mb: 8, fontWeight: 700 }}
          >
            Featured Courses
          </Typography>
          <Grid container spacing={4}>
            {featuredCourses.map((course, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 200,
                      bgcolor: 'grey.200',
                      backgroundImage: `url(${course.imageUrl || 'https://source.unsplash.com/random/400x200?education'})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                      {course.title || 'Course Title'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {course.description || 'Course description goes here. Learn the fundamentals and advance your skills.'}
                    </Typography>
                    <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600 }}>
                      ${course.price || '99.99'}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 3, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => navigate(`/courses/${course._id}`)}
                      sx={{
                        bgcolor: 'primary.main',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                      }}
                    >
                      Learn More
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="md">
          <Typography
            variant="h4"
            align="center"
            sx={{ mb: 3, fontWeight: 600 }}
          >
            Ready to Start Learning?
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Join thousands of learners already learning on LearnHub
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{ px: 4 }}
            >
              Get Started
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 
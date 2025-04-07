import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
  });

  // Check admin token and its validity on component mount
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      queryClient.clear();
      navigate('/admin/login');
      return;
    }

    // Verify token validity
    const verifyToken = async () => {
      try {
        await axios.get('http://localhost:3000/api/v1/admin/verify', {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('adminToken');
        queryClient.clear();
        navigate('/admin/login');
      }
    };

    verifyToken();

    // Cleanup function to clear queries when component unmounts
    return () => {
      queryClient.clear();
    };
  }, [navigate, queryClient]);

  const { data: courses = [], isLoading: coursesLoading, error: coursesError } = useQuery(
    'adminCourses',
    async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('No admin token found');

      const response = await axios.get('http://localhost:3000/api/v1/admin/course/bulk', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.courses;
    },
    {
      enabled: !!localStorage.getItem('adminToken'),
      staleTime: 0,
      cacheTime: 0,
      retry: false,
      onError: (error) => {
        console.error('Courses fetch error:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('adminToken');
          queryClient.clear();
          navigate('/admin/login');
        }
      }
    }
  );

  const { data: users = [], isLoading: usersLoading, error: usersError } = useQuery(
    'adminUsers',
    async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('No admin token found');

      const response = await axios.get('http://localhost:3000/api/v1/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.users;
    },
    {
      enabled: !!localStorage.getItem('adminToken'),
      staleTime: 0,
      cacheTime: 0,
      retry: false,
      onError: (error) => {
        console.error('Users fetch error:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('adminToken');
          queryClient.clear();
          navigate('/admin/login');
        }
      }
    }
  );

  const createCourseMutation = useMutation(
    async (data) => {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post('http://localhost:3000/api/v1/admin/course', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminCourses');
        handleCloseDialog();
      },
      onError: (error) => {
        setError(error.response?.data?.error || 'Failed to create course');
      }
    }
  );

  const deleteCourseMutation = useMutation(
    async (courseId) => {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://localhost:3000/api/v1/admin/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminCourses');
      },
    }
  );

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenDialog = (course = null) => {
    if (course) {
      setSelectedCourse(course);
      setFormData({
        title: course.title,
        description: course.description,
        price: course.price,
        imageUrl: course.imageUrl || '',
      });
    } else {
      setSelectedCourse(null);
      setFormData({
        title: '',
        description: '',
        price: '',
        imageUrl: '',
      });
    }
    setError('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCourse(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      imageUrl: '',
    });
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.price || !formData.imageUrl) {
      setError('All fields are required');
      return;
    }

    // Validate price is a positive number
    if (isNaN(formData.price) || formData.price <= 0) {
      setError('Price must be a positive number');
      return;
    }

    try {
      await createCourseMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        imageUrl: formData.imageUrl
      });
    } catch (error) {
      console.error('Create course error:', error);
    }
  };

  if (!localStorage.getItem('adminToken')) {
    queryClient.clear();
    navigate('/admin/login');
    return null;
  }

  if (coursesLoading || usersLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (coursesError || usersError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {coursesError?.message || usersError?.message || 'An error occurred while loading data'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog()}
        >
          Add New Course
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Courses" />
          <Tab label="Users" />
        </Tabs>
      </Box>

      {activeTab === 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course._id}>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.description}</TableCell>
                  <TableCell>${course.price}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(course)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => deleteCourseMutation.mutate(course._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Purchased Courses</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.purchases?.length || 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              margin="dense"
              required
              fullWidth
              name="title"
              label="Course Title"
              value={formData.title}
              onChange={handleChange}
              autoFocus
            />
            <TextField
              margin="dense"
              required
              fullWidth
              name="description"
              label="Course Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              required
              fullWidth
              name="price"
              label="Price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              inputProps={{ min: 0, step: 0.01 }}
            />
            <TextField
              margin="dense"
              required
              fullWidth
              name="imageUrl"
              label="Image URL"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              type="submit"
              variant="contained"
              color="primary"
              disabled={createCourseMutation.isLoading}
            >
              {createCourseMutation.isLoading ? 'Creating...' : (selectedCourse ? 'Update' : 'Create')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard; 
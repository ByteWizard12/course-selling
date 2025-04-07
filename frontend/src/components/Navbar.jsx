import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const token = localStorage.getItem('token');
  const adminToken = localStorage.getItem('adminToken');
  const isAuthenticated = !!token || !!adminToken;

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    if (adminToken) {
      localStorage.removeItem('adminToken');
      navigate('/admin/login');
    } else {
      localStorage.removeItem('token');
      navigate('/login');
    }
    handleCloseUserMenu();
  };

  const userPages = [
    { title: 'Home', path: '/' },
    { title: 'Courses', path: '/courses' },
  ];

  const authenticatedPages = [
    { title: 'My Courses', path: '/my-courses' },
    { title: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <AppBar position="sticky" sx={{ background: 'white', boxShadow: 1 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <SchoolIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
            }}
          >
            LearnHub
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="primary"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/courses'); }}>
                <Typography textAlign="center">Courses</Typography>
              </MenuItem>
              {!isAuthenticated && (
                <>
                  <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/login'); }}>
                    <Typography textAlign="center">Login</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/signup'); }}>
                    <Typography textAlign="center">Signup</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/admin/login'); }}>
                    <Typography textAlign="center">Admin Login</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/admin/signup'); }}>
                    <Typography textAlign="center">Admin Signup</Typography>
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>

          <SchoolIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: 'primary.main' }} />
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
            }}
          >
            LearnHub
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            <Button
              onClick={() => navigate('/courses')}
              sx={{ my: 2, color: 'primary.main', display: 'block' }}
            >
              Courses
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="User" src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {!adminToken && authenticatedPages.map((page) => (
                    <MenuItem key={page.path} onClick={() => { handleCloseUserMenu(); navigate(page.path); }}>
                      <Typography textAlign="center">{page.title}</Typography>
                    </MenuItem>
                  ))}
                  {adminToken && (
                    <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/admin/dashboard'); }}>
                      <Typography textAlign="center">Admin Dashboard</Typography>
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => navigate('/signup')}
                >
                  Signup
                </Button>
                <Button
                  color="secondary"
                  variant="outlined"
                  onClick={() => navigate('/admin/login')}
                >
                  Admin Login
                </Button>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => navigate('/admin/signup')}
                >
                  Admin Signup
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 
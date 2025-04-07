import { Box, Container, Typography, Link, Grid } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        mt: 'auto',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              LearnHub
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Empowering learners worldwide with quality education and practical skills.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Link href="/courses" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Courses
            </Link>
            <Link href="/login" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Login
            </Link>
            <Link href="/signup" color="text.secondary" display="block">
              Sign Up
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: support@learnhub.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: +1 234 567 8900
            </Typography>
          </Grid>
        </Grid>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 4 }}
        >
          {'© '}
          {new Date().getFullYear()}
          {' LearnHub. All rights reserved.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 
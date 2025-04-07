# LearnHub - Online Course Platform

A full-stack online course platform built with the MERN stack (MongoDB, Express.js, React, Node.js) where users can browse and purchase courses, and administrators can manage courses and users.

## Features

### User Features
- Browse available courses
- User authentication (signup/login)
- Purchase courses
- View purchased courses
- Responsive design for all devices

### Admin Features
- Admin authentication (signup/login)
- Create and manage courses
- View all users
- Monitor course purchases
- Dashboard with analytics

## Tech Stack

### Frontend
- React with Vite
- Material-UI for styling
- React Query for state management
- React Router for navigation
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Cors for cross-origin requests

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd course-selling-project
```

2. Install backend dependencies
```bash
npm install
```

3. Install frontend dependencies
```bash
cd frontend
npm install
```

4. Create environment variables
- Copy `.env.example` to `.env`
- Update the variables with your values

5. Start the development servers

Backend:
```bash
# In the root directory
npm run dev
```

Frontend:
```bash
# In the frontend directory
npm run dev
```

## Project Structure

```
course-selling-project/
├── frontend/                # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── config.js      # API configuration
│   │   └── main.jsx       # Entry point
│   └── package.json
├── routes/                 # Backend API routes
├── middleware/            # Custom middleware
├── db.js                 # Database models
├── index.js             # Backend entry point
└── package.json
```

## API Endpoints

### User Routes
- POST `/api/v1/user/signup` - User registration
- POST `/api/v1/user/signin` - User login
- GET `/api/v1/user/purchases` - Get user's purchased courses
- POST `/api/v1/user/courses/:courseId/purchase` - Purchase a course

### Admin Routes
- POST `/api/v1/admin/signup` - Admin registration
- POST `/api/v1/admin/signin` - Admin login
- GET `/api/v1/admin/verify` - Verify admin token
- GET `/api/v1/admin/users` - Get all users
- GET `/api/v1/admin/course/bulk` - Get all courses
- POST `/api/v1/admin/course` - Create a course
- DELETE `/api/v1/admin/courses/:courseId` - Delete a course

### Course Routes
- GET `/api/v1/course/preview` - Get all courses preview
- GET `/api/v1/course/:courseId` - Get course details

## Deployment

### Backend Deployment (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Add environment variables
4. Deploy the application

### Frontend Deployment (Vercel)
1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables
4. Deploy the application

### Database (MongoDB Atlas)
1. Create a free cluster
2. Configure network access
3. Get your connection string
4. Update MONGO_URL in environment variables

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

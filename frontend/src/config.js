// Log the environment variable to debug
console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL || process.env.REACT_APP_BACKEND_URL);

const BACKEND_URL = 'https://learning-hub-backend-ojrq.onrender.com';

console.log('Using Backend URL:', BACKEND_URL);

export const API_ENDPOINTS = {
    // User endpoints
    USER_SIGNUP: `${BACKEND_URL}/api/v1/user/signup`,
    USER_SIGNIN: `${BACKEND_URL}/api/v1/user/signin`,
    USER_COURSES: `${BACKEND_URL}/api/v1/user/courses`,
    USER_PURCHASE_COURSE: `${BACKEND_URL}/api/v1/user/courses`,

    // Admin endpoints
    ADMIN_SIGNUP: `${BACKEND_URL}/api/v1/admin/signup`,
    ADMIN_SIGNIN: `${BACKEND_URL}/api/v1/admin/signin`,
    ADMIN_VERIFY: `${BACKEND_URL}/api/v1/admin/verify`,
    ADMIN_USERS: `${BACKEND_URL}/api/v1/admin/users`,

    // Course endpoints
    COURSE_PREVIEW: `${BACKEND_URL}/api/v1/course/preview`,
    COURSE_DETAILS: `${BACKEND_URL}/api/v1/course`,
};

export default API_ENDPOINTS; 
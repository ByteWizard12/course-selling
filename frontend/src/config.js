const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const endpoints = {
    // User endpoints
    userSignup: `${API_URL}/api/v1/user/signup`,
    userSignin: `${API_URL}/api/v1/user/signin`,
    userPurchases: `${API_URL}/api/v1/user/purchases`,
    purchaseCourse: (courseId) => `${API_URL}/api/v1/user/courses/${courseId}/purchase`,

    // Admin endpoints
    adminSignup: `${API_URL}/api/v1/admin/signup`,
    adminSignin: `${API_URL}/api/v1/admin/signin`,
    adminVerify: `${API_URL}/api/v1/admin/verify`,
    adminUsers: `${API_URL}/api/v1/admin/users`,
    adminCourses: `${API_URL}/api/v1/admin/course/bulk`,
    createCourse: `${API_URL}/api/v1/admin/course`,
    deleteCourse: (courseId) => `${API_URL}/api/v1/admin/courses/${courseId}`,

    // Course endpoints
    coursePreview: `${API_URL}/api/v1/course/preview`,
    courseDetail: (courseId) => `${API_URL}/api/v1/course/${courseId}`,
}; 
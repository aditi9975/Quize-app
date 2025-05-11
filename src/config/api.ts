const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
  },
  
  // User endpoints
  USERS: {
    PROFILE: `${API_BASE_URL}/users/profile`,
    UPDATE: `${API_BASE_URL}/users/update`,
  },
  
  // Quiz endpoints
  QUIZZES: {
    LIST: `${API_BASE_URL}/quizzes`,
    CREATE: `${API_BASE_URL}/quizzes`,
    GET: (id: string) => `${API_BASE_URL}/quizzes/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/quizzes/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/quizzes/${id}`,
  },
  
  // Quiz Results endpoints
  QUIZ_RESULTS: {
    SUBMIT: `${API_BASE_URL}/quiz-results`,
    GET_USER_RESULTS: `${API_BASE_URL}/quiz-results/user`,
    GET_QUIZ_RESULTS: (quizId: string) => `${API_BASE_URL}/quiz-results/quiz/${quizId}`,
  },
};

export default API_ENDPOINTS; 
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    // Placeholder - returns mock data
    return { token: 'mock_token', user: { id: '1', email, name: 'John Doe' } };
  },
  signup: async (name: string, email: string, password: string) => {
    return { token: 'mock_token', user: { id: '1', email, name } };
  },
  logout: async () => {
    localStorage.removeItem('auth_token');
  },
};

// Roles API
export const rolesAPI = {
  getAll: async () => {
    // Mock data
    return [
      { id: '1', name: 'SDE', description: 'Software Development Engineer', difficulty: 'Medium', skills: ['DSA', 'System Design', 'OOP'], icon: 'code' },
      { id: '2', name: 'Data Analyst', description: 'Analyze and interpret data', difficulty: 'Medium', skills: ['SQL', 'Python', 'Statistics'], icon: 'bar-chart' },
      { id: '3', name: 'DevOps', description: 'Development and Operations', difficulty: 'Hard', skills: ['CI/CD', 'Docker', 'Kubernetes'], icon: 'server' },
      { id: '4', name: 'QA Engineer', description: 'Quality Assurance', difficulty: 'Easy', skills: ['Testing', 'Automation', 'Selenium'], icon: 'check-circle' },
      { id: '5', name: 'ML Engineer', description: 'Machine Learning Engineering', difficulty: 'Hard', skills: ['Python', 'TensorFlow', 'Math'], icon: 'brain' },
      { id: '6', name: 'Frontend Dev', description: 'Frontend Development', difficulty: 'Medium', skills: ['React', 'CSS', 'JavaScript'], icon: 'layout' },
    ];
  },
  getById: async (id: string) => {
    const roles = await rolesAPI.getAll();
    return roles.find(r => r.id === id);
  },
};

// Companies API
export const companiesAPI = {
  getAll: async () => {
    return [
      { id: '1', name: 'Google', logo: '🔍', difficulty: 'Hard', rounds: 5, roles: ['SDE', 'ML Engineer'], avgPackage: '45 LPA', eligibility: { cgpa: 8.0, branches: ['CSE', 'IT', 'ECE'] } },
      { id: '2', name: 'Microsoft', logo: '🪟', difficulty: 'Hard', rounds: 4, roles: ['SDE', 'DevOps'], avgPackage: '42 LPA', eligibility: { cgpa: 7.5, branches: ['CSE', 'IT'] } },
      { id: '3', name: 'Amazon', logo: '📦', difficulty: 'Hard', rounds: 5, roles: ['SDE', 'Data Analyst'], avgPackage: '38 LPA', eligibility: { cgpa: 7.0, branches: ['CSE', 'IT', 'ECE', 'EE'] } },
      { id: '4', name: 'Flipkart', logo: '🛒', difficulty: 'Medium', rounds: 4, roles: ['SDE', 'QA Engineer'], avgPackage: '28 LPA', eligibility: { cgpa: 7.0, branches: ['CSE', 'IT'] } },
      { id: '5', name: 'Atlassian', logo: '🔷', difficulty: 'Hard', rounds: 4, roles: ['SDE', 'Frontend Dev'], avgPackage: '40 LPA', eligibility: { cgpa: 8.0, branches: ['CSE'] } },
      { id: '6', name: 'Adobe', logo: '🎨', difficulty: 'Medium', rounds: 4, roles: ['SDE', 'Frontend Dev'], avgPackage: '32 LPA', eligibility: { cgpa: 7.5, branches: ['CSE', 'IT'] } },
    ];
  },
  getById: async (id: string) => {
    const companies = await companiesAPI.getAll();
    return companies.find(c => c.id === id);
  },
};

// Progress API
export const progressAPI = {
  get: async () => {
    return {
      mcq: 65,
      dsa: 45,
      technical: 30,
      hr: 80,
      overallScore: 55,
      recentAttempts: [
        { id: '1', company: 'Google', date: '2024-01-15', score: 72, round: 'MCQ' },
        { id: '2', company: 'Microsoft', date: '2024-01-14', score: 85, round: 'DSA' },
        { id: '3', company: 'Amazon', date: '2024-01-13', score: 60, round: 'Technical' },
      ],
    };
  },
};

// Questions API
export const questionsAPI = {
  getMCQs: async (companyId?: string, roleId?: string) => {
    return [
      { id: '1', question: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correct: 1, topic: 'DSA' },
      { id: '2', question: 'Which data structure uses LIFO?', options: ['Queue', 'Stack', 'Array', 'LinkedList'], correct: 1, topic: 'DSA' },
      { id: '3', question: 'What is polymorphism in OOP?', options: ['Single inheritance', 'Multiple forms', 'Encapsulation', 'Abstraction'], correct: 1, topic: 'OOP' },
    ];
  },
  getDSA: async (difficulty?: string) => {
    return [
      { id: '1', title: 'Two Sum', difficulty: 'Easy', topics: ['Array', 'Hash Map'], companies: ['Google', 'Amazon'] },
      { id: '2', title: 'LRU Cache', difficulty: 'Medium', topics: ['Hash Map', 'Linked List'], companies: ['Microsoft', 'Facebook'] },
      { id: '3', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', topics: ['Binary Search', 'Array'], companies: ['Google', 'Apple'] },
    ];
  },
};

// Criteria Upload API
export const criteriaAPI = {
  upload: async (file: File | string) => {
    // Mock processing
    return {
      success: true,
      data: {
        eligibility: { cgpa: 7.5, branches: ['CSE', 'IT', 'ECE'] },
        rounds: [
          { type: 'MCQ', topics: ['Aptitude', 'Technical'], duration: 60, questions: 30 },
          { type: 'DSA', topics: ['Arrays', 'Strings', 'Trees'], duration: 90, questions: 3 },
          { type: 'Technical Interview', topics: ['System Design', 'Projects'], duration: 45, questions: null },
          { type: 'HR Interview', topics: ['Behavioral', 'Situational'], duration: 30, questions: null },
        ],
        topics: ['Arrays', 'Strings', 'Trees', 'Dynamic Programming', 'System Design'],
        difficulty: 'Medium-Hard',
        weightage: { dsa: 40, mcq: 30, interview: 30 },
      },
    };
  },
};

export default api;

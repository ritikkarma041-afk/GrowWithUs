import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Using the backend port
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;

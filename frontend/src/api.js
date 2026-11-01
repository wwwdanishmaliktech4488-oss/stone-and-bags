import axios from 'axios';

const API = axios.create({
  // Your live Vercel backend URL + /api
  baseURL: 'https://stone-and-bags.vercel.app/api', 
});

// Automatically attach the JWT token to every request if it exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
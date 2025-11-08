import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/'; // Sesuaikan URL backend Anda

const login = (username, password) => {
  return axios.post(API_URL + 'login', {
    username,
    password,
  });
};

// Fungsi logout bisa ditaruh di sini atau dihandle di AuthContext
// const logout = () => { ... }

const authService = {
  login,
  // logout
};

export default authService;
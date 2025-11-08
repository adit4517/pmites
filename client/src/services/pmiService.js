import axios from 'axios';

const API_URL = 'http://localhost:5000/api/pmi/'; // Sesuaikan URL backend Anda

// Fungsi untuk mendapatkan token dari local storage atau context
const getToken = () => localStorage.getItem('token');


const createPmi = (formData) => {
  const token = getToken();
  return axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`
    },
  });
};

const getAllPmi = () => {
  const token = getToken();
  return axios.get(API_URL, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
};

// ... (tambahkan fungsi lain seperti getPmiById, deletePmi, getStats, dll.)

const pmiService = {
  createPmi,
  getAllPmi,
};

export default pmiService;
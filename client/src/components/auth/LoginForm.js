import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App'; // Sesuaikan path jika perlu
// import logo from '../../assets/logo.png'; // Pastikan path logo benar
import axios from 'axios'; // Untuk HTTP requests

const LoginForm = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const { username, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      // Ganti URL dengan endpoint API login Anda
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data, // Harusnya berisi token
      });
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response && err.response.data && err.response.data.msg
        ? err.response.data.msg
        : 'Login failed. Please check your credentials.';
      setError(errorMessage);
      console.error(err.response ? err.response.data : err.message);
    }
  };

  return (
    <div className="login-box">
      {/* <img src={logo} alt="Logo PMI" /> */}
      <h1>Sistem Rekap Data PMI Kabupaten Rembang</h1>
      <form onSubmit={onSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
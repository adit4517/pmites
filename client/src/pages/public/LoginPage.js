// File: client/src/pages/public/LoginPage.js

import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../App';
import axios from 'axios';

const LoginPage = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { username, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data,
      });

      // Redirect berdasarkan role
      if (res.data.user.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/user/dashboard');
      }

    } catch (err) {
      const errorMessage = err.response && err.response.data && err.response.data.msg
        ? err.response.data.msg
        : 'Login gagal. Periksa kembali kredensial Anda.';
      
      setError(errorMessage);
      console.error(err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div style={{marginBottom: '20px'}}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'var(--primary-color)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '2em',
            fontWeight: 'bold',
            color: 'white'
          }}>
            P
          </div>
        </div>
        
        <h1>Sistem Pendaftaran dan Rekap Data PMI Kabupaten Rembang</h1>
        
        <form onSubmit={onSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username / Email</label>
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={onChange}
              placeholder="Masukkan username atau email"
              required
              autoComplete="username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                value={password}
                onChange={onChange}
                placeholder="Masukkan password"
                required
                autoComplete="current-password"
                style={{ 
                  paddingRight: '45px',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '5px',
                  fontSize: '18px',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '30px',
                  height: '30px'
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
          
          {error && <p className="error-message">{error}</p>}
          
          <button type="submit" disabled={loading}>
            {loading ? 'Login...' : 'Login'}
          </button>
        </form>

        <div style={{
          marginTop: '20px',
          padding: '20px 0',
          borderTop: '1px solid #eee',
          textAlign: 'center'
        }}>
          <p style={{marginBottom: '10px', color: 'var(--text-secondary)'}}>
            Belum punya akun?
          </p>
          <Link 
            to="/register" 
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: 'var(--accent-color)',
              color: 'white',
              borderRadius: '5px',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
          >
            Daftar
          </Link>
        </div>

        <div style={{marginTop: '20px', textAlign: 'center'}}>
          <Link 
            to="/" 
            style={{
              color: 'var(--secondary-color)',
              textDecoration: 'none',
              fontSize: '0.9em'
            }}
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
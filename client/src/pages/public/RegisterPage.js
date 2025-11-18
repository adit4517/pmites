// File: client/src/pages/public/RegisterPage.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    nik: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Laki-laki',
    address: {
      province: 'Jawa Tengah',
      regency: 'Rembang',
      district: '',
      village: '',
      fullAddress: ''
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Limit phone number to 15 characters
    if (name === 'phone' && value.length > 15) {
      return;
    }

    // Limit NIK to 16 characters
    if (name === 'nik' && value.length > 16) {
      return;
    }
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username harus diisi';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username minimal 3 karakter';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.password) {
      newErrors.password = 'Password harus diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nama lengkap harus diisi';
    }

    if (!formData.nik.trim()) {
      newErrors.nik = 'NIK harus diisi';
    } else if (!/^\d{16}$/.test(formData.nik)) {
      newErrors.nik = 'NIK harus 16 digit angka';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor telepon harus diisi';
    } else if (formData.phone.length < 10) {
      newErrors.phone = 'Nomor telepon minimal 10 digit';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Tanggal lahir harus diisi';
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        newErrors.dateOfBirth = 'Usia minimal 18 tahun';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setNotification({
        show: true,
        type: 'error',
        message: 'Mohon perbaiki kesalahan pada form'
      });
      setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...dataToSend } = formData;
      
      const response = await axios.post('http://localhost:5000/api/auth/register', dataToSend);

      setNotification({
        show: true,
        type: 'success',
        message: response.data.msg || 'Registrasi berhasil! Mengalihkan ke halaman login...'
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error('Register error:', error);
      
      const errorMsg = error.response?.data?.msg || 'Terjadi kesalahan. Silakan coba lagi.';
      
      setNotification({
        show: true,
        type: 'error',
        message: errorMsg
      });

      setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
          <button onClick={() => setNotification({ show: false, type: '', message: '' })}>
            &times;
          </button>
        </div>
      )}

      <div className="login-box" style={{ maxWidth: '600px', marginTop: '30px', marginBottom: '30px' }}>
        <div style={{ marginBottom: '20px' }}>
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
        
        <h1>Daftar Sebagai Calon PMI</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '25px' }}>
          Lengkapi data diri Anda untuk membuat akun
        </p>
        
        <form onSubmit={handleSubmit} className="login-form">
          {/* Informasi Akun */}
          <div style={{ 
            marginBottom: '25px', 
            paddingBottom: '20px', 
            borderBottom: '2px solid #eee' 
          }}>
            <h3 style={{ 
              fontSize: '1.1em', 
              marginBottom: '15px', 
              color: 'var(--primary-color)' 
            }}>
              Informasi Akun
            </h3>
            
            <div className="form-group">
              <label htmlFor="username">Username <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="username_anda"
                className={errors.username ? 'error' : ''}
              />
              {errors.username && (
                <small style={{ color: 'var(--error-color)', display: 'block', marginTop: '4px' }}>
                  {errors.username}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email <span style={{ color: 'red' }}>*</span></label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && (
                <small style={{ color: 'var(--error-color)', display: 'block', marginTop: '4px' }}>
                  {errors.email}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password <span style={{ color: 'red' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimal 6 karakter"
                  className={errors.password ? 'error' : ''}
                  style={{ paddingRight: '45px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '5px',
                    fontSize: '18px',
                    color: 'var(--text-secondary)',
                    lineHeight: '1'
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && (
                <small style={{ color: 'var(--error-color)', display: 'block', marginTop: '4px' }}>
                  {errors.password}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Konfirmasi Password <span style={{ color: 'red' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Ulangi password"
                  className={errors.confirmPassword ? 'error' : ''}
                  style={{ paddingRight: '45px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '5px',
                    fontSize: '18px',
                    color: 'var(--text-secondary)',
                    lineHeight: '1'
                  }}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.confirmPassword && (
                <small style={{ color: 'var(--error-color)', display: 'block', marginTop: '4px' }}>
                  {errors.confirmPassword}
                </small>
              )}
            </div>
          </div>

          {/* Data Pribadi */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ 
              fontSize: '1.1em', 
              marginBottom: '15px', 
              color: 'var(--primary-color)' 
            }}>
              Data Pribadi
            </h3>
            
            <div className="form-group">
              <label htmlFor="fullName">Nama Lengkap <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nama lengkap sesuai KTP"
                className={errors.fullName ? 'error' : ''}
              />
              {errors.fullName && (
                <small style={{ color: 'var(--error-color)', display: 'block', marginTop: '4px' }}>
                  {errors.fullName}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="nik">NIK (16 digit) <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                name="nik"
                id="nik"
                value={formData.nik}
                onChange={handleChange}
                maxLength={16}
                placeholder="1234567890123456"
                className={errors.nik ? 'error' : ''}
              />
              <small style={{ color: 'var(--text-light)', display: 'block', marginTop: '4px' }}>
                {formData.nik.length}/16 karakter
              </small>
              {errors.nik && (
                <small style={{ color: 'var(--error-color)', display: 'block', marginTop: '4px' }}>
                  {errors.nik}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Nomor Telepon <span style={{ color: 'red' }}>*</span></label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength={15}
                placeholder="08123456789"
                className={errors.phone ? 'error' : ''}
              />
              <small style={{ color: 'var(--text-light)', display: 'block', marginTop: '4px' }}>
                {formData.phone.length}/15 karakter
              </small>
              {errors.phone && (
                <small style={{ color: 'var(--error-color)', display: 'block', marginTop: '4px' }}>
                  {errors.phone}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="dateOfBirth">Tanggal Lahir <span style={{ color: 'red' }}>*</span></label>
              <input
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={errors.dateOfBirth ? 'error' : ''}
              />
              {errors.dateOfBirth && (
                <small style={{ color: 'var(--error-color)', display: 'block', marginTop: '4px' }}>
                  {errors.dateOfBirth}
                </small>
              )}
            </div>

            <div className="form-group">
              <label>Jenis Kelamin <span style={{ color: 'red' }}>*</span></label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="address.fullAddress">Alamat Lengkap (Opsional)</label>
              <textarea
                name="address.fullAddress"
                id="address.fullAddress"
                value={formData.address.fullAddress}
                onChange={handleChange}
                rows={3}
                placeholder="Jl. Contoh No. 123, RT/RW 01/02..."
              />
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
          </button>

          <div style={{
            marginTop: '20px',
            padding: '15px 0',
            borderTop: '1px solid #eee',
            textAlign: 'center'
          }}>
            <p style={{ marginBottom: '10px', color: 'var(--text-secondary)' }}>
              Sudah punya akun?
            </p>
            <Link 
              to="/login" 
              style={{
                color: 'var(--secondary-color)',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Login di sini
            </Link>
          </div>

          <div style={{ marginTop: '15px', textAlign: 'center' }}>
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
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
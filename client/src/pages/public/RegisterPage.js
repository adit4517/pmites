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
    
    if (name === 'phone' && value.length > 15) return;
    if (name === 'nik' && value.length > 16) return;
    
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

    // <-- NEW: make address.fullAddress required -->
    if (!formData.address.fullAddress || !formData.address.fullAddress.trim()) {
      newErrors['address.fullAddress'] = 'Alamat lengkap harus diisi';
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

  // Styling constants
  const sectionHeaderStyle = {
    fontSize: '1.1em',
    fontWeight: '600',
    marginBottom: '18px',
    color: 'var(--primary-color)',
    paddingBottom: '10px',
    borderBottom: '2px solid var(--primary-color)'
  };

  const sectionContainerStyle = {
    marginBottom: '28px'
  };

  const formGroupStyle = {
    marginBottom: '16px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: 'var(--text-primary)',
    fontSize: '0.95em'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '0.95em',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    backgroundColor: '#fff'
  };

  const inputFocusStyle = {
    ...inputStyle,
    borderColor: 'var(--primary-color)',
    boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.1)'
  };

  const textareaStyle = {
    ...inputStyle,
    resize: 'vertical',
    minHeight: '100px'
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23666%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%3e%3c/polyline%3e%3c/svg%3e")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '20px',
    paddingRight: '40px'
  };

  const errorTextStyle = {
    color: 'var(--error-color)',
    display: 'block',
    marginTop: '6px',
    fontSize: '0.85em',
    fontWeight: '500'
  };

  const helperTextStyle = {
    color: 'var(--text-secondary)',
    display: 'block',
    marginTop: '6px',
    fontSize: '0.85em'
  };

  const charCounterStyle = {
    color: formData.nik.length === 16 ? 'var(--success-color)' : 'var(--text-secondary)',
    display: 'block',
    marginTop: '6px',
    fontSize: '0.85em',
    fontWeight: '500'
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

      <div className="login-box" style={{ maxWidth: '650px', marginTop: '30px', marginBottom: '30px' }}>
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
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
            color: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            P
          </div>
          <h1 style={{ marginBottom: '8px', fontSize: '1.8em' }}>Daftar Sebagai Calon PMI</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95em' }}>
            Lengkapi data diri Anda untuk membuat akun
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {/* Informasi Akun */}
          <div style={sectionContainerStyle}>
            <h3 style={sectionHeaderStyle}>📋 Informasi Akun</h3>
            
            <div style={formGroupStyle}>
              <label htmlFor="username" style={labelStyle}>
                Username <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="username_anda"
                style={{
                  ...inputStyle,
                  borderColor: errors.username ? 'var(--error-color)' : '#ddd',
                  backgroundColor: errors.username ? 'rgba(231, 76, 60, 0.05)' : '#fff'
                }}
              />
              {errors.username && <small style={errorTextStyle}>{errors.username}</small>}
            </div>

            <div style={formGroupStyle}>
              <label htmlFor="email" style={labelStyle}>
                Email <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                style={{
                  ...inputStyle,
                  borderColor: errors.email ? 'var(--error-color)' : '#ddd',
                  backgroundColor: errors.email ? 'rgba(231, 76, 60, 0.05)' : '#fff'
                }}
              />
              {errors.email && <small style={errorTextStyle}>{errors.email}</small>}
            </div>

            <div style={formGroupStyle}>
              <label htmlFor="password" style={labelStyle}>
                Password <span style={{ color: 'red' }}>*</span>
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimal 6 karakter"
                  style={{
                    ...inputStyle,
                    paddingRight: '45px',
                    borderColor: errors.password ? 'var(--error-color)' : '#ddd',
                    backgroundColor: errors.password ? 'rgba(231, 76, 60, 0.05)' : '#fff'
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
              {errors.password && <small style={errorTextStyle}>{errors.password}</small>}
              <small style={helperTextStyle}>Gunakan kombinasi huruf, angka, dan simbol untuk keamanan lebih</small>
            </div>

            <div style={formGroupStyle}>
              <label htmlFor="confirmPassword" style={labelStyle}>
                Konfirmasi Password <span style={{ color: 'red' }}>*</span>
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Ulangi password"
                  style={{
                    ...inputStyle,
                    paddingRight: '45px',
                    borderColor: errors.confirmPassword ? 'var(--error-color)' : '#ddd',
                    backgroundColor: errors.confirmPassword ? 'rgba(231, 76, 60, 0.05)' : '#fff'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Sembunyikan password' : 'Tampilkan password'}
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
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.confirmPassword && <small style={errorTextStyle}>{errors.confirmPassword}</small>}
            </div>
          </div>

          {/* Data Pribadi */}
          <div style={sectionContainerStyle}>
            <h3 style={sectionHeaderStyle}>👤 Data Pribadi</h3>
            
            <div style={formGroupStyle}>
              <label htmlFor="fullName" style={labelStyle}>
                Nama Lengkap <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nama lengkap sesuai KTP"
                style={{
                  ...inputStyle,
                  borderColor: errors.fullName ? 'var(--error-color)' : '#ddd',
                  backgroundColor: errors.fullName ? 'rgba(231, 76, 60, 0.05)' : '#fff'
                }}
              />
              {errors.fullName && <small style={errorTextStyle}>{errors.fullName}</small>}
            </div>

            <div style={formGroupStyle}>
              <label htmlFor="nik" style={labelStyle}>
                NIK (16 digit) <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                name="nik"
                id="nik"
                value={formData.nik}
                onChange={handleChange}
                maxLength={16}
                placeholder="1234567890123456"
                inputMode="numeric"
                style={{
                  ...inputStyle,
                  borderColor: errors.nik ? 'var(--error-color)' : '#ddd',
                  backgroundColor: errors.nik ? 'rgba(231, 76, 60, 0.05)' : '#fff'
                }}
              />
              <small style={charCounterStyle}>
                {formData.nik.length}/16 karakter {formData.nik.length === 16 ? '✓' : ''}
              </small>
              {errors.nik && <small style={errorTextStyle}>{errors.nik}</small>}
            </div>

            <div style={formGroupStyle}>
              <label htmlFor="phone" style={labelStyle}>
                Nomor Telepon <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength={15}
                placeholder="08123456789"
                inputMode="numeric"
                style={{
                  ...inputStyle,
                  borderColor: errors.phone ? 'var(--error-color)' : '#ddd',
                  backgroundColor: errors.phone ? 'rgba(231, 76, 60, 0.05)' : '#fff'
                }}
              />
              <small style={charCounterStyle}>
                {formData.phone.length}/15 karakter
              </small>
              {errors.phone && <small style={errorTextStyle}>{errors.phone}</small>}
            </div>

            <div style={formGroupStyle}>
              <label htmlFor="dateOfBirth" style={labelStyle}>
                Tanggal Lahir <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  borderColor: errors.dateOfBirth ? 'var(--error-color)' : '#ddd',
                  backgroundColor: errors.dateOfBirth ? 'rgba(231, 76, 60, 0.05)' : '#fff'
                }}
              />
              {errors.dateOfBirth && <small style={errorTextStyle}>{errors.dateOfBirth}</small>}
            </div>

            <div style={formGroupStyle}>
              <label htmlFor="gender" style={labelStyle}>
                Jenis Kelamin <span style={{ color: 'red' }}>*</span>
              </label>
              <select
                name="gender"
                id="gender"
                value={formData.gender}
                onChange={handleChange}
                style={selectStyle}
              >
                <option value="Laki-laki">👨 Laki-laki</option>
                <option value="Perempuan">👩 Perempuan</option>
              </select>
            </div>

            <div style={formGroupStyle}>
              <label htmlFor="address.fullAddress" style={labelStyle}>
                Alamat Lengkap <span style={{ color: 'red' }}>*</span>
              </label>
              <textarea
                name="address.fullAddress"
                id="address.fullAddress"
                value={formData.address.fullAddress}
                onChange={handleChange}
                rows={3}
                placeholder="Jl. Contoh No. 123, RT/RW 01/02..."
                style={textareaStyle}
              />
              {errors['address.fullAddress'] && (
                <small style={errorTextStyle}>{errors['address.fullAddress']}</small>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px 20px',
              backgroundColor: loading ? '#95a5a6' : 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1em',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              marginTop: '10px'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = 'var(--secondary-color)')}
            onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = 'var(--primary-color)')}
          >
            {loading ? '⏳ Mendaftar...' : '✓ Daftar Sekarang'}
          </button>

          <div style={{
            marginTop: '24px',
            padding: '18px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            textAlign: 'center',
            borderLeft: '4px solid var(--secondary-color)'
          }}>
            <p style={{ marginBottom: '10px', color: 'var(--text-secondary)', fontSize: '0.95em' }}>
              Sudah punya akun?
            </p>
            <Link 
              to="/login" 
              style={{
                color: 'var(--secondary-color)',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1em'
              }}
            >
              Login di sini →
            </Link>
          </div>

          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <Link 
              to="/" 
              style={{
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '0.9em',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
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
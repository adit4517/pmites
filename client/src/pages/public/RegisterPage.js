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

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
          <button onClick={() => setNotification({ show: false, type: '', message: '' })}>
            &times;
          </button>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Daftar Sebagai Calon PMI
          </h2>
          <p className="text-gray-600">
            Lengkapi data diri Anda untuk membuat akun
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="pmi-form">
            <div className="form-section">
              <h4>Informasi Akun</h4>
              
              <div className="form-group">
                <label>Username <span style={{color: 'red'}}>*</span></label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="username_anda"
                  className={errors.username ? 'error' : ''}
                />
                {errors.username && <small className="error-text">{errors.username}</small>}
              </div>

              <div className="form-group">
                <label>Email <span style={{color: 'red'}}>*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <small className="error-text">{errors.email}</small>}
              </div>

              <div className="form-group">
                <label>Password <span style={{color: 'red'}}>*</span></label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimal 6 karakter"
                  className={errors.password ? 'error' : ''}
                />
                {errors.password && <small className="error-text">{errors.password}</small>}
              </div>

              <div className="form-group">
                <label>Konfirmasi Password <span style={{color: 'red'}}>*</span></label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Ulangi password"
                  className={errors.confirmPassword ? 'error' : ''}
                />
                {errors.confirmPassword && <small className="error-text">{errors.confirmPassword}</small>}
              </div>
            </div>

            <div className="form-section">
              <h4>Data Pribadi</h4>
              
              <div className="form-group">
                <label>Nama Lengkap <span style={{color: 'red'}}>*</span></label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nama lengkap sesuai KTP"
                  className={errors.fullName ? 'error' : ''}
                />
                {errors.fullName && <small className="error-text">{errors.fullName}</small>}
              </div>

              <div className="form-group">
                <label>NIK (16 digit) <span style={{color: 'red'}}>*</span></label>
                <input
                  type="text"
                  name="nik"
                  value={formData.nik}
                  onChange={handleChange}
                  maxLength={16}
                  placeholder="1234567890123456"
                  className={errors.nik ? 'error' : ''}
                />
                {errors.nik && <small className="error-text">{errors.nik}</small>}
              </div>

              <div className="form-group">
                <label>Nomor Telepon <span style={{color: 'red'}}>*</span></label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="08123456789"
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <small className="error-text">{errors.phone}</small>}
              </div>

              <div className="form-group">
                <label>Tanggal Lahir <span style={{color: 'red'}}>*</span></label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={errors.dateOfBirth ? 'error' : ''}
                />
                {errors.dateOfBirth && <small className="error-text">{errors.dateOfBirth}</small>}
              </div>

              <div className="form-group">
                <label>Jenis Kelamin <span style={{color: 'red'}}>*</span></label>
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
                <label>Alamat Lengkap (Opsional)</label>
                <textarea
                  name="address.fullAddress"
                  value={formData.address.fullAddress}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Jl. Contoh No. 123, RT/RW 01/02..."
                />
              </div>
            </div>

            <div className="form-buttons">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
              </button>
              <button type="button" className="reset-btn" onClick={() => navigate('/login')}>
                Sudah Punya Akun
              </button>
            </div>

            <div style={{textAlign: 'center', marginTop: '20px'}}>
              <Link to="/" style={{color: 'var(--secondary-color)', textDecoration: 'none'}}>
                ← Kembali ke Beranda
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
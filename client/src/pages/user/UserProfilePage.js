// File: client/src/pages/user/UserProfilePage.js

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../App';
import axios from 'axios';

const UserProfile = () => {
  const { state } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: {
      province: 'Jawa Tengah',
      regency: 'Rembang',
      district: '',
      village: '',
      fullAddress: ''
    }
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  const fetchUserData = useCallback(async () => {
    try {
      const config = {
        headers: { 'Authorization': `Bearer ${state.token}` }
      };
      const res = await axios.get('http://localhost:5000/api/auth/me', config);
      setUser(res.data.user);
      setFormData({
        fullName: res.data.user.profile.fullName,
        phone: res.data.user.profile.phone,
        dateOfBirth: new Date(res.data.user.profile.dateOfBirth).toISOString().split('T')[0],
        gender: res.data.user.profile.gender,
        address: res.data.user.profile.address || {
          province: 'Jawa Tengah',
          regency: 'Rembang',
          district: '',
          village: '',
          fullAddress: ''
        }
      });
      
      // Set profile picture preview
      if (res.data.user.profile.profilePicture) {
        setProfilePicturePreview(`http://localhost:5000/${res.data.user.profile.profilePicture}`);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  }, [state.token]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

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
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setNotification({
          show: true,
          type: 'error',
          message: 'Ukuran file maksimal 2MB'
        });
        setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
        return;
      }
      
      // Validate file type
      if (!file.type.match('image.*')) {
        setNotification({
          show: true,
          type: 'error',
          message: 'File harus berupa gambar'
        });
        setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
        return;
      }
      
      setProfilePicture(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { 
          'Authorization': `Bearer ${state.token}`,
          'Content-Type': 'multipart/form-data'
        }
      };
      
      const updateData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'address') {
          updateData.append('address', JSON.stringify(formData.address));
        } else {
          updateData.append(key, formData[key]);
        }
      });
      
      if (profilePicture) {
        updateData.append('profilePicture', profilePicture);
      }
      
      await axios.put('http://localhost:5000/api/auth/profile', updateData, config);
      
      setNotification({
        show: true,
        type: 'success',
        message: 'Profil berhasil diupdate!'
      });
      
      setEditing(false);
      setProfilePicture(null);
      fetchUserData();
      
      setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
    } catch (err) {
      setNotification({
        show: true,
        type: 'error',
        message: err.response?.data?.msg || 'Gagal update profil'
      });
      setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setNotification({
        show: true,
        type: 'error',
        message: 'Password baru tidak cocok'
      });
      setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
      return;
    }

    try {
      const config = {
        headers: { 'Authorization': `Bearer ${state.token}` }
      };
      await axios.put('http://localhost:5000/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, config);
      
      setNotification({
        show: true,
        type: 'success',
        message: 'Password berhasil diubah!'
      });
      
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
    } catch (err) {
      setNotification({
        show: true,
        type: 'error',
        message: err.response?.data?.msg || 'Gagal mengubah password'
      });
      setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Memuat data...</p>
      </div>
    );
  }

  return (
    <div>
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
          <button onClick={() => setNotification({ show: false, type: '', message: '' })}>
            &times;
          </button>
        </div>
      )}

      <h1>Profil Saya</h1>

      <div className="dashboard-grid" style={{ marginTop: '20px' }}>
        {/* Profile Picture Card */}
        <div className="dashboard-card">
          <h3>Foto Profil</h3>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            marginTop: '20px'
          }}>
            {profilePicturePreview ? (
              <img 
                src={profilePicturePreview} 
                alt="Profile" 
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  border: '4px solid var(--accent-color)',
                  marginBottom: '20px'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div style={{
              width: '200px',
              height: '200px',
              background: '#ecf0f1',
              borderRadius: '50%',
              border: '4px solid var(--accent-color)',
              display: profilePicturePreview ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '5em',
              color: '#95a5a6',
              marginBottom: '20px'
            }}>
              👤
            </div>
            
            {editing && (
              <div style={{ width: '100%' }}>
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ marginBottom: '10px' }}
                />
                <small style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85em' }}>
                  Maksimal 2MB. Format: JPG, PNG
                </small>
              </div>
            )}
          </div>
        </div>

        {/* Informasi Akun */}
        <div className="dashboard-card">
          <h3>Informasi Akun</h3>
          <div style={{ marginTop: '15px', fontSize: '0.9em' }}>
            <p><strong>Username:</strong> {user?.username}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>NIK:</strong> {user?.profile?.nik}</p>
            <p><strong>Status Akun:</strong> {' '}
              <span style={{ 
                color: user?.isActive ? 'var(--success-color)' : 'var(--error-color)',
                fontWeight: 'bold'
              }}>
                {user?.isActive ? 'Aktif' : 'Tidak Aktif'}
              </span>
            </p>
            <p><strong>Terverifikasi:</strong> {' '}
              <span style={{ 
                color: user?.isVerified ? 'var(--success-color)' : 'var(--warning-color)',
                fontWeight: 'bold'
              }}>
                {user?.isVerified ? 'Ya' : 'Belum'}
              </span>
            </p>
          </div>
        </div>

        {/* Data Pribadi */}
        <div className="dashboard-card" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Data Pribadi</h3>
            {!editing && (
              <button className="edit-btn" onClick={() => setEditing(true)}>
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleUpdateProfile} style={{ marginTop: '15px' }}>
              <div className="form-group">
                <label>Nama Lengkap</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Nomor Telepon</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tanggal Lahir</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Jenis Kelamin</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div className="form-group">
                <label>Alamat Lengkap</label>
                <textarea
                  name="address.fullAddress"
                  value={formData.address.fullAddress}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="form-buttons">
                <button type="submit" className="submit-btn">Simpan</button>
                <button 
                  type="button" 
                  className="reset-btn" 
                  onClick={() => {
                    setEditing(false);
                    setProfilePicture(null);
                    fetchUserData();
                  }}
                >
                  Batal
                </button>
              </div>
            </form>
          ) : (
            <div style={{ marginTop: '15px', fontSize: '0.9em' }}>
              <p><strong>Nama:</strong> {user?.profile?.fullName}</p>
              <p><strong>Telepon:</strong> {user?.profile?.phone}</p>
              <p><strong>Tanggal Lahir:</strong> {new Date(user?.profile?.dateOfBirth).toLocaleDateString('id-ID')}</p>
              <p><strong>Jenis Kelamin:</strong> {user?.profile?.gender}</p>
              <p><strong>Alamat:</strong> {user?.profile?.address?.fullAddress || '-'}</p>
            </div>
          )}
        </div>

        {/* Keamanan */}
        <div className="dashboard-card">
          <h3>Keamanan</h3>
          
          {!showPasswordForm ? (
            <div style={{ marginTop: '15px' }}>
              <p style={{ marginBottom: '15px', fontSize: '0.9em', color: 'var(--text-secondary)' }}>
                Ubah password Anda secara berkala untuk menjaga keamanan akun
              </p>
              <button 
                className="submit-btn" 
                onClick={() => setShowPasswordForm(true)}
              >
                Ubah Password
              </button>
            </div>
          ) : (
            <form onSubmit={handleChangePassword} style={{ marginTop: '15px' }}>
              <div className="form-group">
                <label>Password Lama</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password Baru</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  minLength={6}
                  required
                />
              </div>

              <div className="form-group">
                <label>Konfirmasi Password Baru</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  minLength={6}
                  required
                />
              </div>

              <div className="form-buttons">
                <button type="submit" className="submit-btn">Ubah Password</button>
                <button 
                  type="button" 
                  className="reset-btn" 
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                >
                  Batal
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
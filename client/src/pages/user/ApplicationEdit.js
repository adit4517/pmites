// File: client/src/pages/user/ApplicationEdit.js

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import { rembangData } from '../../data/rembangData';
import { countriesData, profesiData } from '../../data/countriesData';
import axios from 'axios';

const ApplicationEdit = () => {
  const { state } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama: '',
    asalKecamatan: '',
    asalDesa: '',
    jenisKelamin: 'Laki-laki',
    negaraTujuan: '',
    benua: '',
    profesi: '',
    waktuBerangkat: '',
    pendidikanTerakhir: 'SMA/SMK',
    pengalamanKerja: '',
    keterampilan: ''
  });

  const [fileFields, setFileFields] = useState({});
  const [existingDocs, setExistingDocs] = useState({});
  const [docsToDelete, setDocsToDelete] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const config = {
          headers: { 'Authorization': `Bearer ${state.token}` }
        };
        const res = await axios.get('http://localhost:5000/api/pmi/my-application', config);
        const app = res.data.pmi;

        // Check if can edit
        if (!['draft', 'need_revision'].includes(app.status)) {
          alert('Aplikasi tidak dapat diedit pada status saat ini');
          navigate('/user/application/status');
          return;
        }

        // Cari benua dari negara tujuan
        let foundBenua = '';
        Object.keys(countriesData).forEach(benua => {
          if (countriesData[benua].includes(app.negaraTujuan)) {
            foundBenua = benua;
          }
        });

        setFormData({
          nama: app.nama,
          asalKecamatan: app.asal.kecamatan,
          asalDesa: app.asal.desa,
          jenisKelamin: app.jenisKelamin,
          negaraTujuan: app.negaraTujuan,
          benua: foundBenua,
          profesi: app.profesi,
          waktuBerangkat: new Date(app.waktuBerangkat).toISOString().split('T')[0],
          pendidikanTerakhir: app.pendidikanTerakhir,
          pengalamanKerja: app.pengalamanKerja || '',
          keterampilan: app.keterampilan?.join(', ') || ''
        });

        setExistingDocs(app.dokumen);
      } catch (err) {
        console.error('Error fetching application:', err);
        navigate('/user/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [state.token, navigate]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (name === 'asalKecamatan') {
        return { ...prev, asalKecamatan: value, asalDesa: '' };
      }
      if (name === 'benua') {
        return { ...prev, benua: value, negaraTujuan: '' };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file && file.size > maxSize) {
      alert('Ukuran file maksimal 5MB');
      e.target.value = '';
      return;
    }

    setFileFields({ ...fileFields, [e.target.name]: file });
  };

  const handleToggleDocToDelete = (docField) => {
    setDocsToDelete(prev =>
      prev.includes(docField) ? prev.filter(d => d !== docField) : [...prev, docField]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const dataPayload = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key !== 'benua') { // Jangan kirim benua
          dataPayload.append(key, formData[key]);
        }
      });
      
      Object.keys(fileFields).forEach(key => {
        if (fileFields[key]) {
          dataPayload.append(key, fileFields[key]);
        }
      });

      if (docsToDelete.length > 0) {
        dataPayload.append('documentsToDelete', JSON.stringify(docsToDelete));
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${state.token}`
        }
      };

      await axios.put('http://localhost:5000/api/pmi/my-application', dataPayload, config);

      setNotification({
        show: true,
        type: 'success',
        message: 'Aplikasi berhasil diupdate!'
      });

      setTimeout(() => {
        navigate('/user/application/status');
      }, 2000);

    } catch (err) {
      console.error('Error updating application:', err);
      const errorMsg = err.response?.data?.msg || 'Terjadi kesalahan';
      
      setNotification({
        show: true,
        type: 'error',
        message: errorMsg
      });

      setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
    } finally {
      setSubmitting(false);
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

      <h1>Edit Aplikasi PMI</h1>
      <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>
        Perbarui informasi aplikasi Anda
      </p>

      <form onSubmit={handleSubmit} className="pmi-form">
        {/* Form fields sama seperti ApplicationForm.js */}
        <div className="form-section">
          <h4>Data Diri PMI</h4>
          
          <div className="form-group">
            <label htmlFor="nama">Nama Lengkap</label>
            <input 
              type="text" 
              name="nama" 
              id="nama" 
              value={formData.nama} 
              onChange={handleFormChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="asalKecamatan">Asal Kecamatan</label>
            <select
              name="asalKecamatan"
              id="asalKecamatan"
              value={formData.asalKecamatan}
              onChange={handleFormChange}
              required
            >
              <option value="">-- Pilih Kecamatan --</option>
              {Object.keys(rembangData).map(kecamatan => (
                <option key={kecamatan} value={kecamatan}>{kecamatan}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="asalDesa">Asal Desa</label>
            <select
              name="asalDesa"
              id="asalDesa"
              value={formData.asalDesa}
              onChange={handleFormChange}
              required
              disabled={!formData.asalKecamatan}
            >
              <option value="">-- Pilih Desa --</option>
              {formData.asalKecamatan && rembangData[formData.asalKecamatan].map(desa => (
                <option key={desa} value={desa}>{desa}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Jenis Kelamin</label>
            <div className="radio-group">
              <label>
                <input 
                  type="radio" 
                  name="jenisKelamin" 
                  value="Laki-laki" 
                  checked={formData.jenisKelamin === 'Laki-laki'} 
                  onChange={handleFormChange} 
                /> 
                Laki-laki
              </label>
              <label>
                <input 
                  type="radio" 
                  name="jenisKelamin" 
                  value="Perempuan" 
                  checked={formData.jenisKelamin === 'Perempuan'} 
                  onChange={handleFormChange} 
                /> 
                Perempuan
              </label>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4>Data Keberangkatan</h4>
          
          <div className="form-group">
            <label htmlFor="benua">Benua Tujuan</label>
            <select
              name="benua"
              id="benua"
              value={formData.benua}
              onChange={handleFormChange}
              required
            >
              <option value="">-- Pilih Benua --</option>
              {Object.keys(countriesData).map(benua => (
                <option key={benua} value={benua}>{benua}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="negaraTujuan">Negara Tujuan</label>
            <select
              name="negaraTujuan"
              id="negaraTujuan"
              value={formData.negaraTujuan}
              onChange={handleFormChange}
              required
              disabled={!formData.benua}
            >
              <option value="">-- Pilih Negara --</option>
              {formData.benua && countriesData[formData.benua].map(negara => (
                <option key={negara} value={negara}>{negara}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="profesi">Profesi / Pekerjaan</label>
            <select
              name="profesi"
              id="profesi"
              value={formData.profesi}
              onChange={handleFormChange}
              required
            >
              <option value="">-- Pilih Profesi --</option>
              {profesiData.map(profesi => (
                <option key={profesi} value={profesi}>{profesi}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="waktuBerangkat">Rencana Waktu Berangkat</label>
            <input 
              type="date" 
              name="waktuBerangkat" 
              id="waktuBerangkat" 
              value={formData.waktuBerangkat} 
              onChange={handleFormChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="pendidikanTerakhir">Pendidikan Terakhir</label>
            <select
              name="pendidikanTerakhir"
              id="pendidikanTerakhir"
              value={formData.pendidikanTerakhir}
              onChange={handleFormChange}
              required
            >
              <option value="SD">SD</option>
              <option value="SMP">SMP</option>
              <option value="SMA/SMK">SMA/SMK</option>
              <option value="D3">D3</option>
              <option value="S1">S1</option>
              <option value="S2">S2</option>
              <option value="S3">S3</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="pengalamanKerja">Pengalaman Kerja</label>
            <textarea
              name="pengalamanKerja"
              id="pengalamanKerja"
              value={formData.pengalamanKerja}
              onChange={handleFormChange}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="keterampilan">Keterampilan (pisahkan dengan koma)</label>
            <input
              type="text"
              name="keterampilan"
              id="keterampilan"
              value={formData.keterampilan}
              onChange={handleFormChange}
            />
          </div>
        </div>

        {/* Dokumen Tersimpan */}
        <div className="form-section">
          <h4>Dokumen Tersimpan</h4>
          <p style={{ fontSize: '0.9em', color: 'var(--text-secondary)', marginBottom: '15px' }}>
            Centang dokumen yang ingin dihapus, atau upload dokumen baru untuk mengganti
          </p>
          
          <div style={{ marginBottom: '20px' }}>
            {Object.entries(existingDocs).filter(([key, path]) => path).map(([key, path]) => (
              <div key={key} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '10px',
                background: '#f8f9fa',
                borderRadius: '5px',
                marginBottom: '5px'
              }}>
                <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                <label style={{ color: docsToDelete.includes(key) ? 'red' : 'inherit', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={docsToDelete.includes(key)} 
                    onChange={() => handleToggleDocToDelete(key)}
                  /> 
                  {' '}Hapus
                </label>
              </div>
            ))}
          </div>

          <h4 style={{ marginTop: '20px' }}>Upload Dokumen Baru</h4>
          <p style={{ fontSize: '0.9em', color: 'var(--text-secondary)', marginBottom: '15px' }}>
            Upload untuk mengganti dokumen yang sudah ada
          </p>

          {[
            'ktpPmi', 'kk', 'akta', 'ijazah', 'izinKeluarga', 'pasFoto',
            'skck', 'suratSehatJasmani', 'suratSehatRohani', 'bukuNikah',
            'sertifikatKeterampilan', 'dokumenLainnya'
          ].map(fieldName => (
            <div className="form-group" key={fieldName}>
              <label htmlFor={fieldName}>
                {fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
              <input 
                type="file" 
                name={fieldName} 
                id={fieldName} 
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              {fileFields[fieldName] && (
                <small style={{ color: 'var(--success-color)' }}>
                  File baru: {fileFields[fieldName].name}
                </small>
              )}
            </div>
          ))}
        </div>

        <div className="form-buttons">
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
          <button 
            type="button" 
            className="reset-btn" 
            onClick={() => navigate('/user/application/status')}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationEdit;
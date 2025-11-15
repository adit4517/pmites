// File: client/src/pages/admin/DataPmiPage.js

import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../../App';

const DataPmiPage = () => {
  const { state } = useContext(AuthContext);
  const [pmiData, setPmiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPmi, setSelectedPmi] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  const fetchPmiData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const config = {
        headers: { 'Authorization': `Bearer ${state.token}` },
        params: { 
          search: searchTerm,
          status: statusFilter
        }
      };
      const res = await axios.get('http://localhost:5000/api/pmi', config);
      setPmiData(res.data);
    } catch (err) {
      console.error("Error fetching PMI data:", err);
      setError('Gagal memuat data PMI.');
    } finally {
      setLoading(false);
    }
  }, [state.token, searchTerm, statusFilter]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPmiData();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchPmiData]);

  const showNotification = (message, type) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
  };

  const handleView = (pmi) => {
    setSelectedPmi(pmi);
    setShowDetailModal(true);
  };
  
  const handleDownload = (pmiId, docField, fileName) => {
    const downloadUrl = `http://localhost:5000/api/pmi/download/${pmiId}/${docField}`;
    window.open(downloadUrl, '_blank');
  };

  const handleViewDocument = (path) => {
    window.open(`http://localhost:5000/${path}`, '_blank');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini? Data yang dihapus tidak dapat dikembalikan.')) {
      try {
        const config = { headers: { 'Authorization': `Bearer ${state.token}` } };
        await axios.delete(`http://localhost:5000/api/pmi/${id}`, config);
        fetchPmiData();
        showNotification('Data PMI berhasil dihapus.', 'success');
      } catch (err) {
        console.error("Error deleting PMI data:", err);
        showNotification('Gagal menghapus data PMI.', 'error');
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    const colors = {
      'draft': 'background: #95a5a6; color: white;',
      'submitted': 'background: #3498db; color: white;',
      'under_review': 'background: #f39c12; color: white;',
      'need_revision': 'background: #e67e22; color: white;',
      'approved': 'background: #2ecc71; color: white;',
      'rejected': 'background: #e74c3c; color: white;',
      'processing': 'background: #9b59b6; color: white;',
      'departed': 'background: #1abc9c; color: white;',
      'returned': 'background: #34495e; color: white;'
    };
    return colors[status] || 'background: #95a5a6; color: white;';
  };

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

      <div className="dashboard-header">
        <h1>Data PMI</h1>
      </div>
      
      {/* Filter & Search Section */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9em' }}>
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--border-radius-sm)',
                fontSize: '0.95em'
              }}
            >
              <option value="">Semua Status</option>
              <option value="draft">Draft</option>
              <option value="submitted">Menunggu Review</option>
              <option value="under_review">Sedang Direview</option>
              <option value="need_revision">Perlu Revisi</option>
              <option value="approved">Disetujui</option>
              <option value="rejected">Ditolak</option>
              <option value="processing">Dalam Proses</option>
              <option value="departed">Sudah Berangkat</option>
              <option value="returned">Sudah Pulang</option>
            </select>
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9em' }}>
              Pencarian
            </label>
            <input
              type="text"
              placeholder="Cari berdasarkan Nama, ID, Asal, Negara Tujuan, atau Profesi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--border-radius-sm)',
                fontSize: '0.95em'
              }}
            />
          </div>
        </div>

        <div style={{ marginTop: '15px', fontSize: '0.9em', color: 'var(--text-secondary)' }}>
          <strong>Total Data:</strong> {pmiData.length} PMI
        </div>
      </div>

      {/* Data Display */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Memuat data...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      ) : pmiData.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          background: 'white',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '4em', marginBottom: '20px' }}>📂</div>
          <h3>Tidak ada data</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Belum ada data PMI yang cocok dengan filter Anda
          </p>
        </div>
      ) : (
        <div className="dashboard-grid">
          {pmiData.map((pmi) => (
            <div key={pmi._id} className="dashboard-card">
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '15px'
              }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1em' }}>{pmi.nama}</h3>
                  <p style={{ margin: 0, fontSize: '0.85em', color: 'var(--text-secondary)' }}>
                    ID: {pmi.pmiId}
                  </p>
                </div>
                <div 
                  style={{
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8em',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    ...Object.fromEntries(
                      getStatusBadgeClass(pmi.status)
                        .split(';')
                        .map(style => style.trim().split(':').map(s => s.trim()))
                    )
                  }}
                >
                  {pmi.statusLabel}
                </div>
              </div>

              <div style={{ fontSize: '0.9em', marginBottom: '15px', color: 'var(--text-secondary)' }}>
                <p style={{ margin: '5px 0' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>📍 Asal:</strong> {pmi.asal.kecamatan}, {pmi.asal.desa}
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>🌍 Negara:</strong> {pmi.negaraTujuan}
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>💼 Profesi:</strong> {pmi.profesi}
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>👤 Gender:</strong> {pmi.jenisKelamin}
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>📅 Berangkat:</strong> {new Date(pmi.waktuBerangkat).toLocaleDateString('id-ID')}
                </p>
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '8px',
                paddingTop: '15px',
                borderTop: '1px solid #eee'
              }}>
                <button
                  className="view-btn"
                  onClick={() => handleView(pmi)}
                  style={{ flex: 1 }}
                >
                  Detail
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(pmi._id)}
                  style={{ flex: 1 }}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedPmi && (
        <div className="modal">
          <div className="modal-content" style={{maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto'}}>
            <button className="close-btn" onClick={() => setShowDetailModal(false)}>&times;</button>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: 0 }}>Detail Data PMI</h3>
              <div 
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '0.9em',
                  fontWeight: '600',
                  ...Object.fromEntries(
                    getStatusBadgeClass(selectedPmi.status)
                      .split(';')
                      .map(style => style.trim().split(':').map(s => s.trim()))
                  )
                }}
              >
                {selectedPmi.statusLabel}
              </div>
            </div>

            <div className="form-section">
              <h4>Informasi Identitas</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                <div>
                  <p style={{ margin: '5px 0', fontSize: '0.9em' }}>
                    <strong>ID PMI:</strong> {selectedPmi.pmiId}
                  </p>
                  <p style={{ margin: '5px 0', fontSize: '0.9em' }}>
                    <strong>Nama:</strong> {selectedPmi.nama}
                  </p>
                  <p style={{ margin: '5px 0', fontSize: '0.9em' }}>
                    <strong>Jenis Kelamin:</strong> {selectedPmi.jenisKelamin}
                  </p>
                </div>
                <div>
                  <p style={{ margin: '5px 0', fontSize: '0.9em' }}>
                    <strong>Asal:</strong> {selectedPmi.asal.kecamatan}, {selectedPmi.asal.desa}
                  </p>
                  <p style={{ margin: '5px 0', fontSize: '0.9em' }}>
                    <strong>Pendidikan:</strong> {selectedPmi.pendidikanTerakhir}
                  </p>
                  {selectedPmi.keterampilan && selectedPmi.keterampilan.length > 0 && (
                    <p style={{ margin: '5px 0', fontSize: '0.9em' }}>
                      <strong>Keterampilan:</strong> {selectedPmi.keterampilan.join(', ')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>Informasi Keberangkatan</h4>
              <p style={{ margin: '5px 0', fontSize: '0.9em' }}>
                <strong>Negara Tujuan:</strong> {selectedPmi.negaraTujuan}
              </p>
              <p style={{ margin: '5px 0', fontSize: '0.9em' }}>
                <strong>Profesi:</strong> {selectedPmi.profesi}
              </p>
              <p style={{ margin: '5px 0', fontSize: '0.9em' }}>
                <strong>Rencana Berangkat:</strong> {new Date(selectedPmi.waktuBerangkat).toLocaleDateString('id-ID')}
              </p>
              {selectedPmi.pengalamanKerja && (
                <p style={{ margin: '5px 0', fontSize: '0.9em' }}>
                  <strong>Pengalaman Kerja:</strong> {selectedPmi.pengalamanKerja}
                </p>
              )}
            </div>

            <div className="form-section">
              <h4>Dokumen</h4>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Nama Dokumen</th>
                      <th style={{ textAlign: 'center' }}>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(selectedPmi.dokumen).map(([key, path]) => (
                      <tr key={key}>
                        <td>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</td>
                        <td style={{ textAlign: 'center' }}>
                          {path ? (
                            <span style={{ color: 'var(--success-color)', fontWeight: 'bold' }}>✓</span>
                          ) : (
                            <span style={{ color: 'var(--text-light)' }}>-</span>
                          )}
                        </td>
                        <td>
                          {path ? (
                            <>
                              <button 
                                className="view-btn" 
                                onClick={() => handleViewDocument(path)}
                                style={{ marginRight: '5px' }}
                              >
                                Lihat
                              </button>
                              <button 
                                className="download-btn" 
                                onClick={() => handleDownload(selectedPmi._id, key, 'document')}
                              >
                                Unduh
                              </button>
                            </>
                          ) : (
                            <span style={{ color: 'var(--text-light)', fontSize: '0.85em' }}>
                              Tidak ada
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Status History */}
            {selectedPmi.statusHistory && selectedPmi.statusHistory.length > 0 && (
              <div className="form-section">
                <h4>Riwayat Status</h4>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {selectedPmi.statusHistory.slice().reverse().map((history, index) => (
                    <div 
                      key={index}
                      style={{
                        padding: '10px',
                        background: '#f8f9fa',
                        borderRadius: '5px',
                        marginBottom: '8px',
                        fontSize: '0.9em'
                      }}
                    >
                      <div style={{ fontWeight: 'bold' }}>
                        {history.status === 'draft' ? 'Draft' :
                         history.status === 'submitted' ? 'Disubmit' :
                         history.status === 'approved' ? 'Disetujui' :
                         history.status === 'rejected' ? 'Ditolak' :
                         history.status === 'need_revision' ? 'Perlu Revisi' : history.status}
                      </div>
                      <div style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}>
                        {new Date(history.changedAt).toLocaleString('id-ID')}
                      </div>
                      {history.note && (
                        <div style={{ marginTop: '5px', fontStyle: 'italic' }}>
                          "{history.note}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataPmiPage;
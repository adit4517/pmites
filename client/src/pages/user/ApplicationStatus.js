// File: client/src/pages/user/ApplicationStatus.js

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../App';
import axios from 'axios';

const ApplicationStatus = () => {
  const { state } = useContext(AuthContext);
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const config = {
          headers: { 'Authorization': `Bearer ${state.token}` }
        };
        const res = await axios.get('http://localhost:5000/api/pmi/my-application', config);
        setApplication(res.data.pmi);
      } catch (err) {
        console.error('Error fetching application:', err);
        if (err.response?.status === 404) {
          navigate('/user/dashboard');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [state.token, navigate]);

  const fetchApplication = async () => {
    try {
      const config = {
        headers: { 'Authorization': `Bearer ${state.token}` }
      };
      const res = await axios.get('http://localhost:5000/api/pmi/my-application', config);
      setApplication(res.data.pmi);
    } catch (err) {
      console.error('Error fetching application:', err);
      if (err.response?.status === 404) {
        navigate('/user/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitApplication = async () => {
    if (!window.confirm('Apakah Anda yakin ingin submit aplikasi ini? Setelah submit, Anda tidak dapat mengedit sampai admin memberikan feedback.')) {
      return;
    }

    setSubmitting(true);
    try {
      const config = {
        headers: { 'Authorization': `Bearer ${state.token}` }
      };
      await axios.post('http://localhost:5000/api/pmi/my-application/submit', {}, config);
      
      alert('Aplikasi berhasil disubmit! Menunggu review dari admin.');
      fetchApplication();
    } catch (err) {
      console.error('Error submitting application:', err);
      alert(err.response?.data?.msg || 'Gagal submit aplikasi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDocument = (path) => {
    window.open(`http://localhost:5000/${path}`, '_blank');
  };

  const handleDownloadDocument = (pmiId, docField, fileName) => {
    const downloadUrl = `http://localhost:5000/api/pmi/download/${pmiId}/${docField}`;
    window.open(downloadUrl, '_blank');
  };

  const getStatusColor = (status) => {
    const colors = {
      'draft': '#95a5a6',
      'submitted': '#3498db',
      'under_review': '#f39c12',
      'need_revision': '#e67e22',
      'approved': '#2ecc71',
      'rejected': '#e74c3c',
      'processing': '#9b59b6',
      'departed': '#1abc9c',
      'returned': '#34495e'
    };
    return colors[status] || '#95a5a6';
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Memuat data...</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Aplikasi tidak ditemukan</p>
        <Link to="/user/dashboard" className="view-btn">Kembali ke Dashboard</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="dashboard-header">
        <h1>Status Aplikasi PMI</h1>
        <Link to="/user/dashboard" className="view-btn">← Kembali</Link>
      </div>

      {/* Status Badge */}
      <div style={{
        padding: '20px',
        background: getStatusColor(application.status),
        color: 'white',
        borderRadius: '8px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h2 style={{ margin: 0, color: 'white' }}>{application.statusLabel}</h2>
        <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>
          ID: {application.pmiId}
        </p>
      </div>

      {/* Timeline Status */}
      <div className="dashboard-card">
        <h3>Riwayat Status</h3>
        <div style={{ marginTop: '20px' }}>
          {application.statusHistory && application.statusHistory.length > 0 ? (
            <div style={{ position: 'relative', paddingLeft: '40px' }}>
              {application.statusHistory.slice().reverse().map((history, index) => (
                <div key={index} style={{ 
                  marginBottom: '20px',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: '-40px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: getStatusColor(history.status),
                    border: '3px solid white',
                    boxShadow: '0 0 0 2px ' + getStatusColor(history.status)
                  }} />
                  {index < application.statusHistory.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      left: '-31px',
                      top: '20px',
                      width: '2px',
                      height: '100%',
                      background: '#ddd'
                    }} />
                  )}
                  <div style={{
                    padding: '10px',
                    background: '#f8f9fa',
                    borderRadius: '8px'
                  }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>
                      {history.status === 'draft' ? 'Draft' :
                       history.status === 'submitted' ? 'Menunggu Review' :
                       history.status === 'under_review' ? 'Sedang Direview' :
                       history.status === 'need_revision' ? 'Perlu Revisi' :
                       history.status === 'approved' ? 'Disetujui' :
                       history.status === 'rejected' ? 'Ditolak' :
                       history.status === 'processing' ? 'Dalam Proses' :
                       history.status === 'departed' ? 'Sudah Berangkat' :
                       history.status === 'returned' ? 'Sudah Pulang' : history.status}
                    </p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.85em', color: 'var(--text-secondary)' }}>
                      {new Date(history.changedAt).toLocaleString('id-ID')}
                    </p>
                    {history.note && (
                      <p style={{ margin: '5px 0 0 0', fontSize: '0.9em', fontStyle: 'italic' }}>
                        "{history.note}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Belum ada riwayat status</p>
          )}
        </div>
      </div>

      {/* Data Aplikasi */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Data Diri</h3>
          <div style={{ fontSize: '0.9em' }}>
            <p><strong>Nama:</strong> {application.nama}</p>
            <p><strong>Asal:</strong> {application.asal.kecamatan}, {application.asal.desa}</p>
            <p><strong>Jenis Kelamin:</strong> {application.jenisKelamin}</p>
            <p><strong>Pendidikan:</strong> {application.pendidikanTerakhir}</p>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Data Keberangkatan</h3>
          <div style={{ fontSize: '0.9em' }}>
            <p><strong>Negara Tujuan:</strong> {application.negaraTujuan}</p>
            <p><strong>Profesi:</strong> {application.profesi}</p>
            <p><strong>Rencana Berangkat:</strong> {new Date(application.waktuBerangkat).toLocaleDateString('id-ID')}</p>
            {application.keterampilan && application.keterampilan.length > 0 && (
              <p><strong>Keterampilan:</strong> {application.keterampilan.join(', ')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Dokumen */}
      <div className="dashboard-card" style={{ marginTop: '20px' }}>
        <h3>Dokumen Terupload</h3>
        <div style={{ marginTop: '15px' }}>
          {Object.entries(application.dokumen).filter(([key, path]) => path).length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nama Dokumen</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(application.dokumen).filter(([key, path]) => path).map(([key, path]) => (
                    <tr key={key}>
                      <td>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</td>
                      <td>
                        <button 
                          className="view-btn" 
                          onClick={() => handleViewDocument(path)}
                          style={{ marginRight: '5px' }}
                        >
                          Lihat
                        </button>
                        <button 
                          className="download-btn" 
                          onClick={() => handleDownloadDocument(application._id, key, 'document')}
                        >
                          Unduh
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Belum ada dokumen terupload</p>
          )}
        </div>
      </div>

      {/* Catatan Admin */}
      {application.adminNotes && application.adminNotes.length > 0 && (
        <div className="dashboard-card" style={{ marginTop: '20px' }}>
          <h3>Catatan dari Admin</h3>
          <div style={{ marginTop: '15px' }}>
            {application.adminNotes.slice().reverse().map((note, index) => (
              <div key={index} style={{
                padding: '15px',
                background: '#f8f9fa',
                borderLeft: '4px solid var(--secondary-color)',
                borderRadius: '4px',
                marginBottom: '10px'
              }}>
                <p style={{ margin: 0 }}>{note.note}</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '0.85em', color: 'var(--text-secondary)' }}>
                  {new Date(note.createdAt).toLocaleString('id-ID')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revision/Rejection Notes */}
      {(application.revisionNotes || application.rejectionReason) && (
        <div className="dashboard-card" style={{ marginTop: '20px' }}>
          <h3>{application.status === 'rejected' ? 'Alasan Penolakan' : 'Catatan Revisi'}</h3>
          <div style={{
            padding: '15px',
            background: application.status === 'rejected' ? '#fee' : '#fef3cd',
            borderLeft: `4px solid ${application.status === 'rejected' ? 'var(--error-color)' : 'var(--warning-color)'}`,
            borderRadius: '4px',
            marginTop: '10px'
          }}>
            <p style={{ margin: 0 }}>
              {application.revisionNotes || application.rejectionReason}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ marginTop: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {/* Draft - bisa submit dan edit */}
        {application.status === 'draft' && (
          <>
            <button 
              className="submit-btn" 
              onClick={handleSubmitApplication}
              disabled={submitting}
            >
              {submitting ? 'Mengirim...' : 'Submit untuk Review'}
            </button>
            <Link to="/user/application/edit" className="edit-btn">
              Edit Aplikasi
            </Link>
          </>
        )}
        
        {/* Need Revision - bisa edit dan submit ulang setelah revisi */}
        {application.status === 'need_revision' && (
          <>
            <Link to="/user/application/edit" className="edit-btn">
              Revisi Aplikasi
            </Link>
            <button 
              className="submit-btn" 
              onClick={handleSubmitApplication}
              disabled={submitting}
              style={{ marginLeft: '10px' }}
            >
              {submitting ? 'Mengirim...' : 'Submit Ulang'}
            </button>
          </>
        )}

        <Link to="/user/dashboard" className="reset-btn">
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
};

export default ApplicationStatus;
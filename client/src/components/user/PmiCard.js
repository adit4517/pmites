// File: client/src/components/user/PmiCard.js

import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PmiCard = ({ pmiData, onClose }) => {
  const cardRef = useRef();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const element = cardRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [85.6, 53.98] // Ukuran kartu standar (credit card size)
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 53.98);
    pdf.save(`Kartu-PMI-${pmiData.pmiId}.pdf`);
  };

  // Format tanggal lahir
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <div className="modal">
      <div className="modal-content" style={{ maxWidth: '900px' }}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <h3 style={{ marginBottom: '20px' }}>Kartu Identitas PMI</h3>

        {/* Card Preview */}
        <div 
          ref={cardRef}
          style={{
            width: '856px',
            height: '540px',
            margin: '20px auto',
            background: 'linear-gradient(135deg, #2C3E50 0%, #3498DB 100%)',
            borderRadius: '15px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Background Pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '300px',
            height: '300px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '50%',
            transform: 'translate(30%, -30%)'
          }} />
          
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '200px',
            height: '200px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '50%',
            transform: 'translate(-30%, 30%)'
          }} />

          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '30px',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: '#1ABC9C',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2em',
              fontWeight: 'bold',
              boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
            }}>
              P
            </div>
            <div>
              <h2 style={{ 
                margin: 0, 
                fontSize: '1.8em',
                color: 'white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}>
                KARTU IDENTITAS PMI
              </h2>
              <p style={{ margin: '5px 0 0 0', fontSize: '1.1em', opacity: 0.9 }}>
                Kabupaten Rembang
              </p>
            </div>
          </div>

          {/* Content */}
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '10px',
            padding: '25px',
            color: '#2C3E50',
            position: 'relative',
            zIndex: 1
          }}>
            {/* ID PMI Badge */}
            <div style={{
              position: 'absolute',
              top: '-15px',
              right: '20px',
              background: '#1ABC9C',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '20px',
              fontWeight: 'bold',
              fontSize: '1.1em',
              boxShadow: '0 3px 10px rgba(0,0,0,0.2)'
            }}>
              {pmiData.pmiId}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginTop: '20px'
            }}>
              {/* Kolom Kiri */}
              <div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ 
                    fontSize: '0.85em', 
                    color: '#7F8C8D',
                    display: 'block',
                    marginBottom: '5px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Nama Lengkap
                  </label>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '1.3em',
                    fontWeight: 'bold',
                    color: '#2C3E50'
                  }}>
                    {pmiData.nama}
                  </p>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ 
                    fontSize: '0.85em', 
                    color: '#7F8C8D',
                    display: 'block',
                    marginBottom: '5px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Tempat, Tanggal Lahir
                  </label>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '1.1em',
                    color: '#2C3E50'
                  }}>
                    {pmiData.asal.kecamatan}, {formatDate(pmiData.user?.profile?.dateOfBirth || new Date())}
                  </p>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ 
                    fontSize: '0.85em', 
                    color: '#7F8C8D',
                    display: 'block',
                    marginBottom: '5px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Jenis Kelamin
                  </label>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '1.1em',
                    color: '#2C3E50'
                  }}>
                    {pmiData.jenisKelamin}
                  </p>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ 
                    fontSize: '0.85em', 
                    color: '#7F8C8D',
                    display: 'block',
                    marginBottom: '5px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Alamat
                  </label>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '1em',
                    color: '#2C3E50',
                    lineHeight: '1.5'
                  }}>
                    {pmiData.asal.desa}, Kec. {pmiData.asal.kecamatan}, Kab. Rembang
                  </p>
                </div>
              </div>

              {/* Kolom Kanan */}
              <div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ 
                    fontSize: '0.85em', 
                    color: '#7F8C8D',
                    display: 'block',
                    marginBottom: '5px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Negara Tujuan
                  </label>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '1.3em',
                    fontWeight: 'bold',
                    color: '#3498DB'
                  }}>
                    {pmiData.negaraTujuan}
                  </p>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ 
                    fontSize: '0.85em', 
                    color: '#7F8C8D',
                    display: 'block',
                    marginBottom: '5px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Profesi
                  </label>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '1.2em',
                    fontWeight: '600',
                    color: '#2C3E50'
                  }}>
                    {pmiData.profesi}
                  </p>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ 
                    fontSize: '0.85em', 
                    color: '#7F8C8D',
                    display: 'block',
                    marginBottom: '5px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Tanggal Berangkat
                  </label>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '1.1em',
                    color: '#2C3E50'
                  }}>
                    {formatDate(pmiData.waktuBerangkat)}
                  </p>
                </div>

                <div style={{ 
                  marginTop: '30px',
                  padding: '15px',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  borderLeft: '4px solid #1ABC9C'
                }}>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '0.9em',
                    color: '#2C3E50',
                    lineHeight: '1.5'
                  }}>
                    <strong>Status:</strong> {pmiData.statusLabel}<br/>
                    <strong>Disetujui:</strong> {pmiData.approvedAt ? formatDate(pmiData.approvedAt) : '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              marginTop: '25px',
              paddingTop: '20px',
              borderTop: '2px solid #ecf0f1',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ fontSize: '0.8em', color: '#7F8C8D' }}>
                Diterbitkan: {new Date().toLocaleDateString('id-ID')}
              </div>
              <div style={{
                padding: '8px 15px',
                background: '#1ABC9C',
                color: 'white',
                borderRadius: '5px',
                fontSize: '0.85em',
                fontWeight: 'bold'
              }}>
                ✓ TERVERIFIKASI
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-buttons" style={{ justifyContent: 'center', marginTop: '20px' }}>
          <button 
            className="submit-btn" 
            onClick={handleDownloadPDF}
            style={{ minWidth: '150px' }}
          >
            📥 Download PDF
          </button>
          <button 
            className="view-btn" 
            onClick={handlePrint}
            style={{ minWidth: '150px' }}
          >
            🖨️ Print Kartu
          </button>
          <button 
            className="reset-btn" 
            onClick={onClose}
            style={{ minWidth: '150px' }}
          >
            Tutup
          </button>
        </div>

        {/* Print Styles */}
        <style jsx>{`
          @media print {
            body * {
              visibility: hidden;
            }
            ${cardRef.current && `
              #pmi-card, #pmi-card * {
                visibility: visible;
              }
              #pmi-card {
                position: absolute;
                left: 0;
                top: 0;
              }
            `}
          }
        `}</style>
      </div>
    </div>
  );
};

export default PmiCard;
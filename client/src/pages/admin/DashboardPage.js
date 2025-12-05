// File: client/src/pages/admin/DashboardPage.js

import React, { useState, useEffect, useContext, useCallback } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import { AuthContext } from '../../App';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import AsalTable from '../../components/dashboard/AsalTable';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const AsalTablePopup = ({ kecamatan, data, onClose }) => {
  if (!data) return null;
  return (
    <div className="modal" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="modal-content" style={{
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h4 style={{ margin: 0, fontSize: '1.3em', color: '#2c3e50' }}>
            📍 Data Desa di Kecamatan {kecamatan}
          </h4>
          <button 
            className="close-btn" 
            onClick={onClose}
            style={{
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '35px',
              height: '35px',
              fontSize: '1.5em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            &times;
          </button>
        </div>
        {data.length > 0 ? (
          <table className="data-table" style={{ width: '100%', marginTop: '15px' }}>
            <thead>
              <tr style={{ background: '#3498db', color: 'white' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Desa</th>
                <th style={{ padding: '12px', textAlign: 'center', width: '120px' }}>Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={item.desa} style={{ background: idx % 2 === 0 ? '#f8f9fa' : 'white' }}>
                  <td style={{ padding: '10px' }}>{item.desa}</td>
                  <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>{item.jumlah}</td>
                </tr>
              ))}
              <tr style={{ background: '#2c3e50', color: 'white', fontWeight: 'bold' }}>
                <td style={{ padding: '12px' }}>TOTAL</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {data.reduce((sum, item) => sum + item.jumlah, 0)}
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: 'center', padding: '20px', color: '#7f8c8d' }}>
            Tidak ada data desa untuk kecamatan ini.
          </p>
        )}
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { state } = useContext(AuthContext);
  const [isPrinting, setIsPrinting] = useState(false);
  const [jumlahPmi, setJumlahPmi] = useState(0);
  const [asalData, setAsalData] = useState([]);
  const [jenisKelaminData, setJenisKelaminData] = useState({ labels: [], values: [] });
  const [negaraTujuanData, setNegaraTujuanData] = useState({ labels: [], values: [] });
  const [profesiData, setProfesiData] = useState({ labels: [], values: [] });
  const [yearlyData, setYearlyData] = useState({ labels: [], values: [] });
  const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
  const [loading, setLoading] = useState(true);
  const [selectedKecamatan, setSelectedKecamatan] = useState(null);
  const [desaData, setDesaData] = useState([]);
  const [showDesaPopup, setShowDesaPopup] = useState(false);
  
  // Toggle states for tables
  const [negaraShowPercentage, setNegaraShowPercentage] = useState(false);
  const [profesiShowPercentage, setProfesiShowPercentage] = useState(false);

  const fetchAllDashboardData = useCallback(async () => {
    setLoading(true);
    const config = {
      headers: { 'Authorization': `Bearer ${state.token}` },
      params: dateFilter
    };

    try {
      const [
        resJumlah,
        resAsal,
        resJenisKelamin,
        resNegara,
        resProfesi,
        resYearly
      ] = await Promise.all([
        axios.get('http://localhost:5000/api/pmi/stats/jumlah', config),
        axios.get('http://localhost:5000/api/pmi/stats/asal', config),
        axios.get('http://localhost:5000/api/pmi/stats/jenis-kelamin', config),
        axios.get('http://localhost:5000/api/pmi/stats/negara-tujuan', config),
        axios.get('http://localhost:5000/api/pmi/stats/profesi', config),
        axios.get('http://localhost:5000/api/pmi/stats/yearly', { headers: { 'Authorization': `Bearer ${state.token}` } })
      ]);

      setJumlahPmi(resJumlah.data.jumlahPmiRembang);
      setAsalData(Array.isArray(resAsal.data) ? resAsal.data.map(item => ({ kecamatan: item.kecamatan, jumlah: item.jumlah })) : []);
      setJenisKelaminData({ 
        labels: Array.isArray(resJenisKelamin.data) ? resJenisKelamin.data.map(d => d.jenisKelamin) : [], 
        values: Array.isArray(resJenisKelamin.data) ? resJenisKelamin.data.map(d => d.jumlah) : [] 
      });
      setNegaraTujuanData({ 
        labels: Array.isArray(resNegara.data) ? resNegara.data.map(d => d.negara) : [], 
        values: Array.isArray(resNegara.data) ? resNegara.data.map(d => d.jumlah) : [] 
      });
      setProfesiData({ 
        labels: Array.isArray(resProfesi.data) ? resProfesi.data.map(d => d.profesi) : [], 
        values: Array.isArray(resProfesi.data) ? resProfesi.data.map(d => d.jumlah) : [] 
      });
      setYearlyData({
        labels: Array.isArray(resYearly.data) ? resYearly.data.map(d => d.tahun) : [],
        values: Array.isArray(resYearly.data) ? resYearly.data.map(d => d.jumlah) : []
      });

    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, [state.token, dateFilter]);

  useEffect(() => {
    if ((dateFilter.startDate && dateFilter.endDate) || (!dateFilter.startDate && !dateFilter.endDate)) {
      const handler = setTimeout(() => {
        fetchAllDashboardData();
      }, 500);
      return () => clearTimeout(handler);
    }
  }, [fetchAllDashboardData, dateFilter]);

  const handleFilterChange = (e) => {
    setDateFilter(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleKecamatanClick = async (kecamatan) => {
    setSelectedKecamatan(kecamatan);
    try {
      const config = { 
        headers: { 'Authorization': `Bearer ${state.token}` },
        params: dateFilter 
      };
      const res = await axios.get(`http://localhost:5000/api/pmi/stats/asal/desa/${kecamatan}`, config);
      setDesaData(res.data);
      setShowDesaPopup(true);
    } catch (error) {
      console.error(`Error fetching desa data for ${kecamatan}:`, error);
      setDesaData([]);
    }
  };

  const handlePrintToPdf = useCallback(async () => {
    setIsPrinting(true);
    let allDesaDetailsMap = {};
    
    if (asalData && asalData.length > 0) {
      const detailPromises = asalData.map(kec => {
        const configForDesaDetails = {
          headers: { 'Authorization': `Bearer ${state.token}` },
          params: dateFilter
        };
        return axios.get(`http://localhost:5000/api/pmi/stats/asal/desa/${kec.kecamatan}`, configForDesaDetails)
          .then(res => ({ kecamatan: kec.kecamatan, desaList: res.data }))
          .catch(err => {
            console.error(`Gagal mengambil detail desa untuk ${kec.kecamatan}:`, err);
            return { kecamatan: kec.kecamatan, desaList: [] };
          });
      });

      try {
        const allDesaDetailsRaw = await Promise.all(detailPromises);
        allDesaDetailsMap = allDesaDetailsRaw.reduce((acc, curr) => {
          acc[curr.kecamatan] = curr.desaList;
          return acc;
        }, {});
      } catch (error) {
        console.error("Gagal mengambil semua detail desa:", error);
      }
    }

    const pdf = new jsPDF('p', 'pt', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let startY = 60;

    // Header dengan border
    pdf.setDrawColor(41, 128, 185);
    pdf.setLineWidth(3);
    pdf.line(40, 30, pageWidth - 40, 30);
    
    pdf.setFontSize(20);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(41, 128, 185);
    pdf.text('LAPORAN DASHBOARD DATA PMI', pageWidth / 2, startY, { align: 'center' });
    startY += 25;
    
    pdf.setFontSize(14);
    pdf.setTextColor(52, 73, 94);
    pdf.text('KABUPATEN REMBANG', pageWidth / 2, startY, { align: 'center' });
    startY += 30;

    pdf.setDrawColor(41, 128, 185);
    pdf.setLineWidth(1);
    pdf.line(40, startY, pageWidth - 40, startY);
    startY += 25;

    // Info Tanggal
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(100, 100, 100);
    
    if (dateFilter.startDate && dateFilter.endDate) {
      pdf.setFont(undefined, 'bold');
      pdf.text('Periode Laporan:', 40, startY);
      pdf.setFont(undefined, 'normal');
      pdf.text(
        `${new Date(dateFilter.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} - ${new Date(dateFilter.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 
        150, startY
      );
      startY += 18;
    }
    
    pdf.setFont(undefined, 'bold');
    pdf.text('Dicetak pada:', 40, startY);
    pdf.setFont(undefined, 'normal');
    pdf.text(
      `${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB`, 
      150, startY
    );
    startY += 30;

    // Summary Box
    pdf.setFillColor(236, 240, 241);
    pdf.roundedRect(40, startY, pageWidth - 80, 50, 5, 5, 'F');
    
    pdf.setFontSize(12);
    pdf.setTextColor(52, 73, 94);
    pdf.setFont(undefined, 'bold');
    pdf.text('TOTAL PMI TERDAFTAR:', 60, startY + 20);
    
    pdf.setFontSize(24);
    pdf.setTextColor(41, 128, 185);
    pdf.text(jumlahPmi.toString(), 60, startY + 42);
    
    pdf.setFontSize(10);
    pdf.setTextColor(149, 165, 166);
    pdf.text('Pekerja Migran Indonesia', 150, startY + 42);
    
    startY += 70;

    // Function to add new page with header
    const addPageWithHeader = () => {
      pdf.addPage();
      startY = 40;
      pdf.setDrawColor(41, 128, 185);
      pdf.setLineWidth(1);
      pdf.line(40, 30, pageWidth - 40, 30);
      startY = 50;
    };

    // Check if need new page
    const checkNewPage = (spaceNeeded) => {
      if (startY + spaceNeeded > pageHeight - 50) {
        addPageWithHeader();
      }
    };

    // 1. STATISTIK ASAL KECAMATAN
    if (asalData.length > 0) {
      checkNewPage(100);
      
      pdf.setFillColor(41, 128, 185);
      pdf.roundedRect(40, startY, pageWidth - 80, 30, 5, 5, 'F');
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont(undefined, 'bold');
      pdf.text('📍 STATISTIK ASAL KECAMATAN DAN DESA PMI', 55, startY + 20);
      startY += 45;

      asalData.forEach((kecamatanItem, idx) => {
        checkNewPage(150);
        
        // Kecamatan Header
        pdf.setFillColor(52, 152, 219);
        pdf.roundedRect(40, startY, pageWidth - 80, 25, 3, 3, 'F');
        
        pdf.setFontSize(11);
        pdf.setTextColor(255, 255, 255);
        pdf.setFont(undefined, 'bold');
        pdf.text(`${idx + 1}. Kecamatan ${kecamatanItem.kecamatan}`, 50, startY + 16);
        
        pdf.setFont(undefined, 'normal');
        pdf.text(`Total: ${kecamatanItem.jumlah} PMI`, pageWidth - 120, startY + 16);
        startY += 35;

        const desaListOfKecamatan = allDesaDetailsMap[kecamatanItem.kecamatan];
        if (desaListOfKecamatan && desaListOfKecamatan.length > 0) {
          checkNewPage(desaListOfKecamatan.length * 20 + 60);
          
          autoTable(pdf, {
            startY: startY,
            head: [['Nama Desa', 'Jumlah PMI']],
            body: desaListOfKecamatan.map(item => [item.desa, item.jumlah]),
            foot: [['TOTAL KECAMATAN', kecamatanItem.jumlah]],
            theme: 'striped',
            headStyles: { 
              fillColor: [149, 165, 166],
              textColor: 255,
              fontSize: 10,
              fontStyle: 'bold',
              halign: 'center'
            },
            footStyles: {
              fillColor: [52, 73, 94],
              textColor: 255,
              fontSize: 10,
              fontStyle: 'bold',
              halign: 'center'
            },
            styles: { 
              fontSize: 9,
              cellPadding: 8
            },
            columnStyles: {
              0: { cellWidth: pageWidth - 200 },
              1: { halign: 'center', cellWidth: 100 }
            },
            margin: { left: 50, right: 40 },
            alternateRowStyles: { fillColor: [245, 245, 245] }
          });
          startY = pdf.lastAutoTable.finalY + 20;
        } else {
          pdf.setFontSize(9);
          pdf.setTextColor(189, 195, 199);
          pdf.setFont(undefined, 'italic');
          pdf.text('Tidak ada data detail desa', 60, startY);
          startY += 25;
        }
      });
      startY += 10;
    }

    // 2. STATISTIK JENIS KELAMIN
    if (jenisKelaminData.labels.length > 0) {
      checkNewPage(150);
      
      pdf.setFillColor(46, 204, 113);
      pdf.roundedRect(40, startY, pageWidth - 80, 30, 5, 5, 'F');
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text('👥 STATISTIK JENIS KELAMIN PMI', 55, startY + 20);
      startY += 45;

      const totalGender = jenisKelaminData.values.reduce((a, b) => a + b, 0);
      const genderBody = jenisKelaminData.labels.map((label, index) => {
        const value = jenisKelaminData.values[index];
        const percentage = ((value / totalGender) * 100).toFixed(1);
        return [label, value, `${percentage}%`];
      });

      autoTable(pdf, {
        startY: startY,
        head: [['Jenis Kelamin', 'Jumlah', 'Persentase']],
        body: genderBody,
        foot: [['TOTAL', totalGender, '100%']],
        theme: 'grid',
        headStyles: { 
          fillColor: [46, 204, 113],
          fontSize: 11,
          fontStyle: 'bold',
          halign: 'center'
        },
        footStyles: {
          fillColor: [39, 174, 96],
          textColor: 255,
          fontSize: 11,
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: { fontSize: 10, cellPadding: 10 },
        columnStyles: {
          0: { cellWidth: 200 },
          1: { halign: 'center', cellWidth: 150 },
          2: { halign: 'center', cellWidth: 150 }
        },
        margin: { left: 50 }
      });
      startY = pdf.lastAutoTable.finalY + 30;
    }

    // 3. STATISTIK NEGARA TUJUAN
    if (negaraTujuanData.labels.length > 0) {
      checkNewPage(150);
      
      pdf.setFillColor(155, 89, 182);
      pdf.roundedRect(40, startY, pageWidth - 80, 30, 5, 5, 'F');
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text('🌍 STATISTIK NEGARA TUJUAN PMI', 55, startY + 20);
      startY += 45;

      const totalNegara = negaraTujuanData.values.reduce((a, b) => a + b, 0);
      const negaraBody = negaraTujuanData.labels.map((label, index) => {
        const value = negaraTujuanData.values[index];
        const percentage = ((value / totalNegara) * 100).toFixed(1);
        return [label, value, `${percentage}%`];
      });

      autoTable(pdf, {
        startY: startY,
        head: [['Negara Tujuan', 'Jumlah PMI', 'Persentase']],
        body: negaraBody,
        foot: [['TOTAL', totalNegara, '100%']],
        theme: 'grid',
        headStyles: { 
          fillColor: [155, 89, 182],
          fontSize: 11,
          fontStyle: 'bold',
          halign: 'center'
        },
        footStyles: {
          fillColor: [142, 68, 173],
          textColor: 255,
          fontSize: 11,
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: { fontSize: 10, cellPadding: 10 },
        columnStyles: {
          0: { cellWidth: 200 },
          1: { halign: 'center', cellWidth: 150 },
          2: { halign: 'center', cellWidth: 150 }
        },
        margin: { left: 50 }
      });
      startY = pdf.lastAutoTable.finalY + 30;
    }
    
    // 4. STATISTIK PROFESI
    if (profesiData.labels.length > 0) {
      checkNewPage(150);
      
      pdf.setFillColor(230, 126, 34);
      pdf.roundedRect(40, startY, pageWidth - 80, 30, 5, 5, 'F');
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text('💼 STATISTIK PROFESI PMI', 55, startY + 20);
      startY += 45;

      const totalProfesi = profesiData.values.reduce((a, b) => a + b, 0);
      const profesiBody = profesiData.labels.map((label, index) => {
        const value = profesiData.values[index];
        const percentage = ((value / totalProfesi) * 100).toFixed(1);
        return [label, value, `${percentage}%`];
      });

      autoTable(pdf, {
        startY: startY,
        head: [['Profesi', 'Jumlah PMI', 'Persentase']],
        body: profesiBody,
        foot: [['TOTAL', totalProfesi, '100%']],
        theme: 'grid',
        headStyles: { 
          fillColor: [230, 126, 34],
          fontSize: 11,
          fontStyle: 'bold',
          halign: 'center'
        },
        footStyles: {
          fillColor: [211, 84, 0],
          textColor: 255,
          fontSize: 11,
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: { fontSize: 10, cellPadding: 10 },
        columnStyles: {
          0: { cellWidth: 200 },
          1: { halign: 'center', cellWidth: 150 },
          2: { halign: 'center', cellWidth: 150 }
        },
        margin: { left: 50 }
      });
    }

    // Footer pada setiap halaman
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(149, 165, 166);
      pdf.setFont(undefined, 'italic');
      pdf.text(
        `Dokumen ini digenerate otomatis oleh Sistem Informasi PMI Kabupaten Rembang`,
        pageWidth / 2,
        pageHeight - 30,
        { align: 'center' }
      );
      pdf.text(
        `Halaman ${i} dari ${pageCount}`,
        pageWidth / 2,
        pageHeight - 20,
        { align: 'center' }
      );
    }

    pdf.save(`Laporan_Dashboard_PMI_${new Date().toISOString().split('T')[0]}.pdf`);
    setIsPrinting(false);
  }, [state.token, jumlahPmi, asalData, jenisKelaminData, negaraTujuanData, profesiData, dateFilter]);

  const calculatePercentage = (value, total) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : 0;
  };

  const totalNegara = negaraTujuanData.values.reduce((a, b) => a + b, 0);
  const totalProfesi = profesiData.values.reduce((a, b) => a + b, 0);

  // Pie Chart for Gender
  const genderPieData = {
    labels: jenisKelaminData.labels,
    datasets: [{
      data: jenisKelaminData.values,
      backgroundColor: [
        'rgba(52, 152, 219, 0.8)',
        'rgba(231, 76, 60, 0.8)',
        'rgba(46, 204, 113, 0.8)',
        'rgba(155, 89, 182, 0.8)'
      ],
      borderColor: [
        'rgba(52, 152, 219, 1)',
        'rgba(231, 76, 60, 1)',
        'rgba(46, 204, 113, 1)',
        'rgba(155, 89, 182, 1)'
      ],
      borderWidth: 2
    }]
  };

  const genderPieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'bottom',
        labels: {
          padding: 15,
          font: { size: 12 }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  // Line Chart for Yearly Data
  const yearlyLineData = {
    labels: yearlyData.labels,
    datasets: [{
      label: 'Jumlah PMI per Tahun',
      data: yearlyData.values,
      borderColor: 'rgba(41, 128, 185, 1)',
      backgroundColor: 'rgba(41, 128, 185, 0.1)',
      tension: 0.4,
      fill: true,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBackgroundColor: 'rgba(41, 128, 185, 1)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2
    }]
  };

  const yearlyLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true, 
        position: 'top',
        labels: { font: { size: 13, weight: 'bold' } }
      },
      title: { 
        display: true, 
        text: '📊 Tren Perkembangan PMI Berdasarkan Tahun',
        font: { size: 16, weight: 'bold' },
        padding: 20
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: function(value) {
            if (value % 1 === 0) return value;
          }
        },
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  return (
    <div style={{ padding: '0 20px 20px' }}>
      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '15px',
        padding: '30px',
        marginBottom: '30px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
        color: 'white'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '2em' }}>📊 Dashboard Statistik PMI</h1>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '1.05em' }}>
          Kabupaten Rembang, Jawa Tengah
        </p>
      </div>

      {/* Filter & Print Section */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '25px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ fontWeight: '600', color: '#2c3e50' }}>📅 Rentang Waktu:</label>
          <input 
            type="date" 
            name="startDate" 
            value={dateFilter.startDate} 
            onChange={handleFilterChange}
            style={{
              padding: '10px 15px',
              borderRadius: '8px',
              border: '2px solid #e0e0e0',
              fontSize: '0.95em'
            }}
          />
          <span style={{ color: '#7f8c8d', fontWeight: 'bold' }}>—</span>
          <input 
            type="date" 
            name="endDate" 
            value={dateFilter.endDate} 
            onChange={handleFilterChange}
            style={{
              padding: '10px 15px',
              borderRadius: '8px',
              border: '2px solid #e0e0e0',
              fontSize: '0.95em'
            }}
          />
        </div>
        <button 
          className="print-btn" 
          onClick={handlePrintToPdf} 
          disabled={isPrinting}
          style={{
            background: isPrinting ? '#95a5a6' : 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 25px',
            borderRadius: '8px',
            fontSize: '1em',
            fontWeight: '600',
            cursor: isPrinting ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 10px rgba(231, 76, 60, 0.3)',
            transition: 'all 0.3s'
          }}
        >
          {isPrinting ? '⏳ Mencetak...' : '🖨️ Cetak Laporan PDF'}
        </button>
      </div>

      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '60px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#7f8c8d', fontSize: '1.1em' }}>Memuat data statistik...</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {/* Card: Jumlah Total PMI */}
          <div style={{
            background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
            borderRadius: '15px',
            padding: '30px',
            color: 'white',
            boxShadow: '0 8px 20px rgba(52, 152, 219, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '180px'
          }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '1.2em', opacity: 0.9 }}>👥 Total PMI Terdaftar</h3>
            <p style={{ 
              fontSize: '3.5em', 
              fontWeight: 'bold',
              margin: 0,
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
            }}>
              {jumlahPmi.toLocaleString('id-ID')}
            </p>
            <small style={{ marginTop: '10px', opacity: 0.8 }}>Pekerja Migran Indonesia</small>
          </div>

          {/* AsalTable Component */}
          <div style={{ gridColumn: 'span 1' }}>
            <AsalTable asalData={asalData} onKecamatanClick={handleKecamatanClick} />
          </div>

          {/* Gender Pie Chart */}
          <div className="dashboard-card" style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ 
              margin: '0 0 20px 0',
              fontSize: '1.3em',
              color: '#2c3e50',
              borderBottom: '3px solid #3498db',
              paddingBottom: '12px'
            }}>
              👥 Jenis Kelamin PMI
            </h3>
            <div style={{ height: '280px', marginBottom: '20px' }}>
              <Pie data={genderPieData} options={genderPieOptions} />
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              marginTop: '20px'
            }}>
              {jenisKelaminData.labels.map((label, index) => {
                const value = jenisKelaminData.values[index];
                const total = jenisKelaminData.values.reduce((a, b) => a + b, 0);
                const percentage = calculatePercentage(value, total);
                return (
                  <div key={label} style={{
                    background: '#f8f9fa',
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontWeight: 'bold', color: '#2c3e50', marginBottom: '5px' }}>
                      {label}
                    </div>
                    <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#3498db' }}>
                      {value}
                    </div>
                    <div style={{ fontSize: '0.9em', color: '#7f8c8d' }}>
                      {percentage}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Negara Tujuan Table */}
          <div className="dashboard-card" style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px',
              borderBottom: '3px solid #9b59b6',
              paddingBottom: '12px'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.3em', color: '#2c3e50' }}>
                🌍 Negara Tujuan
              </h3>
              <button 
                onClick={() => setNegaraShowPercentage(!negaraShowPercentage)}
                style={{
                  padding: '8px 16px',
                  fontSize: '0.85em',
                  background: negaraShowPercentage ? '#9b59b6' : '#ecf0f1',
                  color: negaraShowPercentage ? 'white' : '#2c3e50',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
              >
                {negaraShowPercentage ? '📊 %' : '🔢 #'}
              </button>
            </div>
            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ position: 'sticky', top: 0, background: '#9b59b6', color: 'white' }}>
                  <tr>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Negara</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', width: '120px' }}>
                      {negaraShowPercentage ? 'Persentase' : 'Jumlah'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {negaraTujuanData.labels.map((label, index) => (
                    <tr key={label} style={{ 
                      borderBottom: '1px solid #ecf0f1',
                      background: index % 2 === 0 ? '#fafafa' : 'white'
                    }}>
                      <td style={{ padding: '12px' }}>{label}</td>
                      <td style={{ 
                        padding: '12px', 
                        textAlign: 'center', 
                        fontWeight: 'bold',
                        color: '#9b59b6'
                      }}>
                        {negaraShowPercentage 
                          ? `${calculatePercentage(negaraTujuanData.values[index], totalNegara)}%`
                          : negaraTujuanData.values[index]
                        }
                      </td>
                    </tr>
                  ))}
                  <tr style={{ background: '#9b59b6', color: 'white', fontWeight: 'bold' }}>
                    <td style={{ padding: '12px' }}>TOTAL</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {negaraShowPercentage ? '100%' : totalNegara}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Profesi Table */}
          <div className="dashboard-card" style={{
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px',
              borderBottom: '3px solid #e67e22',
              paddingBottom: '12px'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.3em', color: '#2c3e50' }}>
                💼 Profesi PMI
              </h3>
              <button 
                onClick={() => setProfesiShowPercentage(!profesiShowPercentage)}
                style={{
                  padding: '8px 16px',
                  fontSize: '0.85em',
                  background: profesiShowPercentage ? '#e67e22' : '#ecf0f1',
                  color: profesiShowPercentage ? 'white' : '#2c3e50',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
              >
                {profesiShowPercentage ? '📊 %' : '🔢 #'}
              </button>
            </div>
            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ position: 'sticky', top: 0, background: '#e67e22', color: 'white' }}>
                  <tr>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Profesi</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', width: '120px' }}>
                      {profesiShowPercentage ? 'Persentase' : 'Jumlah'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {profesiData.labels.map((label, index) => (
                    <tr key={label} style={{ 
                      borderBottom: '1px solid #ecf0f1',
                      background: index % 2 === 0 ? '#fafafa' : 'white'
                    }}>
                      <td style={{ padding: '12px' }}>{label}</td>
                      <td style={{ 
                        padding: '12px', 
                        textAlign: 'center', 
                        fontWeight: 'bold',
                        color: '#e67e22'
                      }}>
                        {profesiShowPercentage 
                          ? `${calculatePercentage(profesiData.values[index], totalProfesi)}%`
                          : profesiData.values[index]
                        }
                      </td>
                    </tr>
                  ))}
                  <tr style={{ background: '#e67e22', color: 'white', fontWeight: 'bold' }}>
                    <td style={{ padding: '12px' }}>TOTAL</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {profesiShowPercentage ? '100%' : totalProfesi}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Yearly Line Chart */}
          <div className="dashboard-card" style={{
            gridColumn: 'span 2',
            background: 'white',
            borderRadius: '15px',
            padding: '25px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <div style={{ height: '400px' }}>
              <Line data={yearlyLineData} options={yearlyLineOptions} />
            </div>
          </div>
        </div>
      )}

            {showDesaPopup && (
              <AsalTablePopup 
                kecamatan={selectedKecamatan} 
                data={desaData} 
                onClose={() => setShowDesaPopup(false)} 
              />
            )}
          </div>
        );
      };
      
      export default DashboardPage;
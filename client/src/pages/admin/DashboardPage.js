import React, { useState, useEffect, useContext, useCallback } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios'; // Impor axios di baris terpisah
import { AuthContext } from '../../App';
import PieChart from '../../components/common/PieChart';
import BarChart from '../../components/common/BarChart';
import AsalTable from '../../components/dashboard/AsalTable';

// Komponen AsalTablePopup - sebaiknya di file terpisah, tapi untuk sekarang kita biarkan di sini
const AsalTablePopup = ({ kecamatan, data, onClose }) => {
    if (!data) return null;
    return (
        <div className="modal">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>&times;</button>
                <h4>Data Desa di Kecamatan {kecamatan}</h4>
                {data.length > 0 ? (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Desa</th>
                                <th>Jumlah</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(item => (
                                <tr key={item.desa}>
                                    <td>{item.desa}</td>
                                    <td>{item.jumlah}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : <p>Tidak ada data desa untuk kecamatan ini.</p>}
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
    const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });
    const [loading, setLoading] = useState(true);
    const [selectedKecamatan, setSelectedKecamatan] = useState(null);
    const [desaData, setDesaData] = useState([]);
    const [showDesaPopup, setShowDesaPopup] = useState(false);

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
                resProfesi
            ] = await Promise.all([
                axios.get('http://localhost:5000/api/pmi/stats/jumlah', config),
                axios.get('http://localhost:5000/api/pmi/stats/asal', config),
                axios.get('http://localhost:5000/api/pmi/stats/jenis-kelamin', config),
                axios.get('http://localhost:5000/api/pmi/stats/negara-tujuan', config),
                axios.get('http://localhost:5000/api/pmi/stats/profesi', config)
            ]);

            setJumlahPmi(resJumlah.data.jumlahPmiRembang);
            // Pastikan resAsal.data adalah array sebelum di map
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
    
    // Implementasi fungsi handleKecamatanClick
    const handleKecamatanClick = async (kecamatan) => {
        setSelectedKecamatan(kecamatan);
        try {
            const config = { 
                headers: { 'Authorization': `Bearer ${state.token}` },
                // Kirim juga filter tanggal saat mengambil detail desa
                params: dateFilter 
            };
            const res = await axios.get(`http://localhost:5000/api/pmi/stats/asal/desa/${kecamatan}`, config);
            setDesaData(res.data);
            setShowDesaPopup(true);
        } catch (error) {
            console.error(`Error fetching desa data for ${kecamatan}:`, error);
            setDesaData([]); // Reset data desa jika error
        }
    };

    const handlePrintToPdf = useCallback(async () => { // Jadikan async
      setIsPrinting(true);

      // 1. Ambil detail desa untuk semua kecamatan yang ada di asalData
      let allDesaDetailsMap = {};
      if (asalData && asalData.length > 0) {
          const detailPromises = asalData.map(kec => {
              // Pastikan config untuk API call ini juga menggunakan token dan dateFilter
              const configForDesaDetails = {
                  headers: { 'Authorization': `Bearer ${state.token}` },
                  params: dateFilter
              };
              return axios.get(`http://localhost:5000/api/pmi/stats/asal/desa/${kec.kecamatan}`, configForDesaDetails)
                  .then(res => ({ kecamatan: kec.kecamatan, desaList: res.data }))
                  .catch(err => {
                      console.error(`Gagal mengambil detail desa untuk ${kec.kecamatan}:`, err);
                      return { kecamatan: kec.kecamatan, desaList: [] }; // Kembalikan array kosong jika error
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
              // Tetap lanjutkan pembuatan PDF dengan data yang ada
          }
      }

      // 2. Mulai buat PDF
      const pdf = new jsPDF('p', 'pt', 'a4');
      let startY = 40;

      // Judul Laporan
      pdf.setFontSize(18);
      pdf.text('Laporan Dashboard Data PMI Kabupaten Rembang', 40, startY);
      startY += 30;

      // Informasi Filter Tanggal dan Waktu Cetak
      if (dateFilter.startDate && dateFilter.endDate) {
          pdf.setFontSize(10);
          pdf.text(`Rentang Waktu: ${new Date(dateFilter.startDate).toLocaleDateString('id-ID')} - ${new Date(dateFilter.endDate).toLocaleDateString('id-ID')}`, 40, startY);
          startY += 20;
      }
      pdf.setFontSize(10);
      pdf.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB`, 40, startY);
      startY += 30;

      // 2a. Jumlah Total PMI
      pdf.setFontSize(12);
      pdf.text(`Jumlah Total PMI (sesuai filter): ${jumlahPmi}`, 40, startY);
      startY += 30;

      // 2b. Statistik Asal Kecamatan DAN Detail Desanya
      if (asalData.length > 0) {
          pdf.setFontSize(14);
          pdf.text('Statistik Asal Kecamatan dan Detail Desa PMI:', 40, startY);
          startY += 25; // Beri jarak lebih sebelum tabel pertama

          asalData.forEach(kecamatanItem => {
              // Judul per Kecamatan
              pdf.setFontSize(12);
              pdf.setTextColor(40); // Warna teks normal
              pdf.text(`Kecamatan: ${kecamatanItem.kecamatan} (Total: ${kecamatanItem.jumlah} PMI)`, 40, startY);
              startY += 20;

              // Tabel detail desa untuk kecamatan ini
              const desaListOfKecamatan = allDesaDetailsMap[kecamatanItem.kecamatan];
              if (desaListOfKecamatan && desaListOfKecamatan.length > 0) {
                  autoTable(pdf, {
                      startY: startY,
                      head: [['Desa', 'Jumlah PMI']],
                      body: desaListOfKecamatan.map(item => [item.desa, item.jumlah]),
                      theme: 'striped',
                      headStyles: { fillColor: [74, 90, 102] }, // Warna header sub-tabel
                      styles: { fontSize: 9 },
                      margin: { left: 50 } // Sedikit indentasi untuk sub-tabel
                  });
                  startY = pdf.lastAutoTable.finalY + 15; // Jarak setelah sub-tabel
              } else {
                  pdf.setFontSize(9);
                  pdf.setTextColor(100); // Warna teks abu-abu
                  pdf.text('(Tidak ada data detail desa atau jumlah 0)', 50, startY);
                  startY += 20; // Jarak jika tidak ada data desa
              }
              startY += 5; // Tambahan spasi antar kecamatan
          });
          startY += 15; // Spasi setelah semua data kecamatan selesai
      }

      // 2c. Tabel Jenis Kelamin PMI
      if (jenisKelaminData.labels.length > 0) {
        pdf.setFontSize(14);
        pdf.text('Statistik Jenis Kelamin PMI:', 40, startY);
        startY += 20;
        autoTable(pdf, {
            startY: startY,
            head: [['Jenis Kelamin', 'Jumlah']],
            body: jenisKelaminData.labels.map((label, index) => [label, jenisKelaminData.values[index]]),
            theme: 'grid',
            headStyles: { fillColor: [22, 160, 133] },
        });
        startY = pdf.lastAutoTable.finalY + 30;
      }

      // 2d. Tabel Negara Tujuan PMI
      if (negaraTujuanData.labels.length > 0) {
        pdf.setFontSize(14);
        pdf.text('Statistik Negara Tujuan PMI:', 40, startY);
        startY += 20;
        autoTable(pdf, {
            startY: startY,
            head: [['Negara Tujuan', 'Jumlah']],
            body: negaraTujuanData.labels.map((label, index) => [label, negaraTujuanData.values[index]]),
            theme: 'grid',
            headStyles: { fillColor: [22, 160, 133] },
        });
        startY = pdf.lastAutoTable.finalY + 30;
      }
      
      // 2e. Tabel Profesi PMI
      if (profesiData.labels.length > 0) {
        pdf.setFontSize(14);
        pdf.text('Statistik Profesi PMI:', 40, startY);
        startY += 20;
        autoTable(pdf, {
            startY: startY,
            head: [['Profesi', 'Jumlah']],
            body: profesiData.labels.map((label, index) => [label, profesiData.values[index]]),
            theme: 'grid',
            headStyles: { fillColor: [22, 160, 133] },
        });
        // Tidak perlu update startY jika ini section terakhir
    }

      pdf.save(`Laporan Dashboard PMI - ${new Date().toLocaleDateString('id-ID')}.pdf`);
      setIsPrinting(false);

  }, [
      state.token, // tambahkan state.token ke dependensi
      jumlahPmi, 
      asalData, 
      jenisKelaminData, 
      negaraTujuanData, 
      profesiData, 
      dateFilter
      // selectedKecamatan dan desaData dari state UI tidak lagi relevan langsung di sini
      // karena kita fetch ulang semua detail desa saat cetak
  ]);
  

  return (
        <div> {/* Tambahkan div pembungkus utama jika belum ada */}
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <div className="filter-and-print-container">
                    <div className="filter-container">
                        <label>Rentang Waktu:</label>
                        <input type="date" name="startDate" value={dateFilter.startDate} onChange={handleFilterChange} />
                        <span>-</span>
                        <input type="date" name="endDate" value={dateFilter.endDate} onChange={handleFilterChange} />
                    </div>
                    <button className="print-btn" onClick={handlePrintToPdf} disabled={isPrinting}>
                        {isPrinting ? 'Mencetak...' : 'Cetak Laporan (PDF)'}
                    </button>
                </div>
            </div>

            <div>
                {loading ? <p>Memuat data statistik...</p> :
                    <div className="dashboard-grid">
                        <div className="dashboard-card">
                            <h3>Jumlah PMI</h3>
                            <p style={{ fontSize: '2em', fontWeight: 'bold' }}>{jumlahPmi}</p>
                        </div>

                        <AsalTable asalData={asalData} onKecamatanClick={handleKecamatanClick} />

                        <div className="dashboard-card">
                            <PieChart data={jenisKelaminData} title="Jenis Kelamin PMI" />
                        </div>

                        <div className="dashboard-card">
                            <BarChart data={negaraTujuanData} title="Negara Tujuan PMI" />
                        </div>

                        <div className="dashboard-card profesi-card">
                            <h3>Profesi PMI</h3>
                            <PieChart data={profesiData} title="" />
                        </div>
                    </div>
                }
            </div>

            {showDesaPopup && (
                <AsalTablePopup kecamatan={selectedKecamatan} data={desaData} onClose={() => setShowDesaPopup(false)} />
            )}
        </div>
    );
};

export default DashboardPage;

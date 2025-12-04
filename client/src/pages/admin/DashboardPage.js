// File: client/src/pages/admin/DashboardPage.js

import React, { useState, useEffect, useContext, useCallback } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { AuthContext } from "../../App";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import AsalTable from "../../components/dashboard/AsalTable";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AsalTablePopup = ({ kecamatan, data, onClose }) => {
  if (!data) return null;
  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
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
              {data.map((item) => (
                <tr key={item.desa}>
                  <td>{item.desa}</td>
                  <td>{item.jumlah}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Tidak ada data desa untuk kecamatan ini.</p>
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
  const [jenisKelaminData, setJenisKelaminData] = useState({
    labels: [],
    values: [],
  });
  const [negaraTujuanData, setNegaraTujuanData] = useState({
    labels: [],
    values: [],
  });
  const [profesiData, setProfesiData] = useState({ labels: [], values: [] });
  const [yearlyData, setYearlyData] = useState({ labels: [], values: [] });
  const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" });
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
      headers: { Authorization: `Bearer ${state.token}` },
      params: dateFilter,
    };

    try {
      const [
        resJumlah,
        resAsal,
        resJenisKelamin,
        resNegara,
        resProfesi,
        resYearly,
      ] = await Promise.all([
        axios.get("http://localhost:5000/api/pmi/stats/jumlah", config),
        axios.get("http://localhost:5000/api/pmi/stats/asal", config),
        axios.get("http://localhost:5000/api/pmi/stats/jenis-kelamin", config),
        axios.get("http://localhost:5000/api/pmi/stats/negara-tujuan", config),
        axios.get("http://localhost:5000/api/pmi/stats/profesi", config),
        axios.get("http://localhost:5000/api/pmi/stats/yearly", {
          headers: { Authorization: `Bearer ${state.token}` },
        }),
      ]);

      setJumlahPmi(resJumlah.data.jumlahPmiRembang);
      setAsalData(
        Array.isArray(resAsal.data)
          ? resAsal.data.map((item) => ({
              kecamatan: item.kecamatan,
              jumlah: item.jumlah,
            }))
          : []
      );
      setJenisKelaminData({
        labels: Array.isArray(resJenisKelamin.data)
          ? resJenisKelamin.data.map((d) => d.jenisKelamin)
          : [],
        values: Array.isArray(resJenisKelamin.data)
          ? resJenisKelamin.data.map((d) => d.jumlah)
          : [],
      });
      setNegaraTujuanData({
        labels: Array.isArray(resNegara.data)
          ? resNegara.data.map((d) => d.negara)
          : [],
        values: Array.isArray(resNegara.data)
          ? resNegara.data.map((d) => d.jumlah)
          : [],
      });
      setProfesiData({
        labels: Array.isArray(resProfesi.data)
          ? resProfesi.data.map((d) => d.profesi)
          : [],
        values: Array.isArray(resProfesi.data)
          ? resProfesi.data.map((d) => d.jumlah)
          : [],
      });
      setYearlyData({
        labels: Array.isArray(resYearly.data)
          ? resYearly.data.map((d) => d.tahun)
          : [],
        values: Array.isArray(resYearly.data)
          ? resYearly.data.map((d) => d.jumlah)
          : [],
      });
    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, [state.token, dateFilter]);

  useEffect(() => {
    if (
      (dateFilter.startDate && dateFilter.endDate) ||
      (!dateFilter.startDate && !dateFilter.endDate)
    ) {
      const handler = setTimeout(() => {
        fetchAllDashboardData();
      }, 500);
      return () => clearTimeout(handler);
    }
  }, [fetchAllDashboardData, dateFilter]);

  const handleFilterChange = (e) => {
    setDateFilter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleKecamatanClick = async (kecamatan) => {
    setSelectedKecamatan(kecamatan);
    try {
      const config = {
        headers: { Authorization: `Bearer ${state.token}` },
        params: dateFilter,
      };
      const res = await axios.get(
        `http://localhost:5000/api/pmi/stats/asal/desa/${kecamatan}`,
        config
      );
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
      const detailPromises = asalData.map((kec) => {
        const configForDesaDetails = {
          headers: { Authorization: `Bearer ${state.token}` },
          params: dateFilter,
        };
        return axios
          .get(
            `http://localhost:5000/api/pmi/stats/asal/desa/${kec.kecamatan}`,
            configForDesaDetails
          )
          .then((res) => ({ kecamatan: kec.kecamatan, desaList: res.data }))
          .catch((err) => {
            console.error(
              `Gagal mengambil detail desa untuk ${kec.kecamatan}:`,
              err
            );
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

    const pdf = new jsPDF("p", "pt", "a4");
    let startY = 40;

    pdf.setFontSize(18);
    pdf.text("Laporan Dashboard Data PMI Kabupaten Rembang", 40, startY);
    startY += 30;

    if (dateFilter.startDate && dateFilter.endDate) {
      pdf.setFontSize(10);
      pdf.text(
        `Rentang Waktu: ${new Date(dateFilter.startDate).toLocaleDateString(
          "id-ID"
        )} - ${new Date(dateFilter.endDate).toLocaleDateString("id-ID")}`,
        40,
        startY
      );
      startY += 20;
    }
    pdf.setFontSize(10);
    pdf.text(
      `Dicetak pada: ${new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })} WIB`,
      40,
      startY
    );
    startY += 30;

    pdf.setFontSize(12);
    pdf.text(`Jumlah Total PMI (sesuai filter): ${jumlahPmi}`, 40, startY);
    startY += 30;

    if (asalData.length > 0) {
      pdf.setFontSize(14);
      pdf.text("Statistik Asal Kecamatan dan Detail Desa PMI:", 40, startY);
      startY += 25;

      asalData.forEach((kecamatanItem) => {
        pdf.setFontSize(12);
        pdf.setTextColor(40);
        pdf.text(
          `Kecamatan: ${kecamatanItem.kecamatan} (Total: ${kecamatanItem.jumlah} PMI)`,
          40,
          startY
        );
        startY += 20;

        const desaListOfKecamatan = allDesaDetailsMap[kecamatanItem.kecamatan];
        if (desaListOfKecamatan && desaListOfKecamatan.length > 0) {
          autoTable(pdf, {
            startY: startY,
            head: [["Desa", "Jumlah PMI"]],
            body: desaListOfKecamatan.map((item) => [item.desa, item.jumlah]),
            theme: "striped",
            headStyles: { fillColor: [74, 90, 102] },
            styles: { fontSize: 9 },
            margin: { left: 50 },
          });
          startY = pdf.lastAutoTable.finalY + 15;
        } else {
          pdf.setFontSize(9);
          pdf.setTextColor(100);
          pdf.text("(Tidak ada data detail desa atau jumlah 0)", 50, startY);
          startY += 20;
        }
        startY += 5;
      });
      startY += 15;
    }

    if (jenisKelaminData.labels.length > 0) {
      pdf.setFontSize(14);
      pdf.text("Statistik Jenis Kelamin PMI:", 40, startY);
      startY += 20;
      autoTable(pdf, {
        startY: startY,
        head: [["Jenis Kelamin", "Jumlah"]],
        body: jenisKelaminData.labels.map((label, index) => [
          label,
          jenisKelaminData.values[index],
        ]),
        theme: "grid",
        headStyles: { fillColor: [22, 160, 133] },
      });
      startY = pdf.lastAutoTable.finalY + 30;
    }

    if (negaraTujuanData.labels.length > 0) {
      pdf.setFontSize(14);
      pdf.text("Statistik Negara Tujuan PMI:", 40, startY);
      startY += 20;
      autoTable(pdf, {
        startY: startY,
        head: [["Negara Tujuan", "Jumlah"]],
        body: negaraTujuanData.labels.map((label, index) => [
          label,
          negaraTujuanData.values[index],
        ]),
        theme: "grid",
        headStyles: { fillColor: [22, 160, 133] },
      });
      startY = pdf.lastAutoTable.finalY + 30;
    }

    if (profesiData.labels.length > 0) {
      pdf.setFontSize(14);
      pdf.text("Statistik Profesi PMI:", 40, startY);
      startY += 20;
      autoTable(pdf, {
        startY: startY,
        head: [["Profesi", "Jumlah"]],
        body: profesiData.labels.map((label, index) => [
          label,
          profesiData.values[index],
        ]),
        theme: "grid",
        headStyles: { fillColor: [22, 160, 133] },
      });
    }

    pdf.save(
      `Laporan Dashboard PMI - ${new Date().toLocaleDateString("id-ID")}.pdf`
    );
    setIsPrinting(false);
  }, [
    state.token,
    jumlahPmi,
    asalData,
    jenisKelaminData,
    negaraTujuanData,
    profesiData,
    dateFilter,
  ]);

  const calculatePercentage = (value, total) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : 0;
  };

  const totalNegara = negaraTujuanData.values.reduce((a, b) => a + b, 0);
  const totalProfesi = profesiData.values.reduce((a, b) => a + b, 0);

  // Pie Chart for Gender
  const genderPieData = {
    labels: jenisKelaminData.labels,
    datasets: [
      {
        data: jenisKelaminData.values,
        backgroundColor: ["rgba(54, 162, 235, 0.8)", "rgba(255, 99, 132, 0.8)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 2,
      },
    ],
  };

  const genderPieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Line Chart for Yearly Data
  const yearlyLineData = {
    labels: yearlyData.labels,
    datasets: [
      {
        label: "Jumlah PMI per Tahun",
        data: yearlyData.values,
        borderColor: "rgba(26, 188, 156, 1)",
        backgroundColor: "rgba(26, 188, 156, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const yearlyLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top" },
      title: { display: true, text: "Tren PMI Berdasarkan Tahun" },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: function (value) {
            if (value % 1 === 0) return value;
          },
        },
      },
    },
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="filter-and-print-container">
          <div className="filter-container">
            <label>Rentang Waktu:</label>
            <input
              type="date"
              name="startDate"
              value={dateFilter.startDate}
              onChange={handleFilterChange}
            />
            <span>-</span>
            <input
              type="date"
              name="endDate"
              value={dateFilter.endDate}
              onChange={handleFilterChange}
            />
          </div>
          <button
            className="print-btn"
            onClick={handlePrintToPdf}
            disabled={isPrinting}
          >
            {isPrinting ? "Mencetak..." : "Cetak Laporan (PDF)"}
          </button>
        </div>
      </div>

      <div>
        {loading ? (
          <p>Memuat data statistik...</p>
        ) : (
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Jumlah PMI</h3>
              <p style={{ fontSize: "2em", fontWeight: "bold" }}>{jumlahPmi}</p>
            </div>

            <AsalTable
              asalData={asalData}
              onKecamatanClick={handleKecamatanClick}
            />

            {/* Gender Pie Chart with Percentage */}
            <div className="dashboard-card">
              <h3>Jenis Kelamin PMI</h3>
              <div className="chart-container">
                <Pie data={genderPieData} options={genderPieOptions} />
              </div>
              <div style={{ marginTop: "15px", textAlign: "center" }}>
                {jenisKelaminData.labels.map((label, index) => {
                  const value = jenisKelaminData.values[index];
                  const total = jenisKelaminData.values.reduce(
                    (a, b) => a + b,
                    0
                  );
                  const percentage = calculatePercentage(value, total);
                  return (
                    <p
                      key={label}
                      style={{ margin: "5px 0", fontSize: "0.95em" }}
                    >
                      <strong>{label}:</strong> {value} ({percentage}%)
                    </p>
                  );
                })}
              </div>
            </div>

            {/* Negara Tujuan Table */}
            <div className="dashboard-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <h3 style={{ margin: 0 }}>Negara Tujuan PMI</h3>
                <button
                  onClick={() => setNegaraShowPercentage(!negaraShowPercentage)}
                  className="view-btn"
                  style={{ padding: "6px 12px", fontSize: "0.85em" }}
                >
                  {negaraShowPercentage ? "Tampilkan Angka" : "Tampilkan %"}
                </button>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Negara</th>
                    <th>Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {negaraTujuanData.labels.map((label, index) => (
                    <tr key={label}>
                      <td>{label}</td>
                      <td>
                        {negaraShowPercentage
                          ? `${calculatePercentage(
                              negaraTujuanData.values[index],
                              totalNegara
                            )}%`
                          : negaraTujuanData.values[index]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Profesi Table */}
            <div className="dashboard-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <h3 style={{ margin: 0 }}>Profesi PMI</h3>
                <button
                  onClick={() =>
                    setProfesiShowPercentage(!profesiShowPercentage)
                  }
                  className="view-btn"
                  style={{ padding: "6px 12px", fontSize: "0.85em" }}
                >
                  {profesiShowPercentage ? "Tampilkan Angka" : "Tampilkan %"}
                </button>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Profesi</th>
                    <th>Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {profesiData.labels.map((label, index) => (
                    <tr key={label}>
                      <td>{label}</td>
                      <td>
                        {profesiShowPercentage
                          ? `${calculatePercentage(
                              profesiData.values[index],
                              totalProfesi
                            )}%`
                          : profesiData.values[index]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Yearly Line Chart */}
            <div className="dashboard-card" style={{ gridColumn: "span 3" }}>
              <div className="chart-container" style={{ height: "350px" }}>
                <Line data={yearlyLineData} options={yearlyLineOptions} />
              </div>
            </div>
          </div>
        )}
      </div>

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

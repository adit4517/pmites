import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ data, title }) => {
  if (!data || !data.labels || data.labels.length === 0) {
    return <p>Data untuk chart {title} tidak tersedia.</p>;
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Jumlah PMI',
        data: data.values,
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
      },
    ],
  };

  const options = {
    indexAxis: 'y', // Membuat bar menjadi horizontal agar label tidak bertumpuk
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Sembunyikan legenda karena sudah ada judul
      },
      title: {
        display: true,
        text: title,
      },
    },
     scales: {
      x: {
        beginAtZero: true,
        ticks: {
            // Paksa step/langkah antar angka menjadi 1
            stepSize: 1,
            // Pastikan hanya integer yang ditampilkan
            callback: function(value) {
                if (value % 1 === 0) {
                    return value;
                }
            }
        }
    }
}
};

  return (
    <div className="chart-container">
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default BarChart;
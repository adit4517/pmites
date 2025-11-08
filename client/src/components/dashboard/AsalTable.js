import React from 'react';

const AsalTable = ({ asalData = [], onKecamatanClick }) => {
    return (
        <div className="dashboard-card">
            <h3>Asal Kecamatan PMI</h3>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Kecamatan</th>
                            <th>Jumlah</th>
                            {/* TAMBAHKAN KOLOM BARU UNTUK AKSI */}
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {asalData.map(item => (
                            <tr key={item.kecamatan}>
                                <td>{item.kecamatan}</td>
                                <td>{item.jumlah}</td>
                                {/* TAMBAHKAN TOMBOL DETAIL DI SINI */}
                                <td>
                                    <button 
                                        className="view-btn" 
                                        onClick={() => onKecamatanClick(item.kecamatan)}
                                    >
                                        Detail Desa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AsalTable;
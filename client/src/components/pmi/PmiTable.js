// File: client/src/components/pmi/PmiTable.js

import React from 'react';

// Komponen kecil untuk menampilkan baris dokumen agar lebih rapi
const DocumentSubTable = ({ documents, pmiId, onViewDocument, onDownloadDocument }) => {
    // Pastikan documents adalah objek sebelum diolah
    if (!documents || typeof documents !== 'object') {
        return <small>Tidak ada data dokumen.</small>;
    }

    const validDocuments = Object.entries(documents).filter(([key, path]) => path);

    if (validDocuments.length === 0) {
        return <small>Tidak ada dokumen terlampir.</small>;
    }

    return (
        <ul style={{ margin: 0, paddingLeft: '15px', listStyle: 'none' }}>
            {validDocuments.map(([key, path]) => {
                const fileName = typeof path === 'string' ? path.split(/[/\\]/).pop() : 'dokumen';
                const documentLabel = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                
                return (
                    <li key={key} style={{ marginBottom: '8px' }}>
                        {documentLabel}:
                        <div style={{ marginTop: '5px' }}>
                            <button 
                                className="view-btn" 
                                onClick={() => onViewDocument(pmiId, key)}
                                style={{ marginRight: '5px', padding: '4px 8px', fontSize: '0.85em' }}
                            >
                                Lihat
                            </button>
                            <button 
                                className="download-btn" 
                                onClick={() => onDownloadDocument(pmiId, key, fileName)}
                                style={{ padding: '4px 8px', fontSize: '0.85em' }}
                            >
                                Unduh
                            </button>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

// Komponen utama tabel
const PmiTable = ({ pmiData = [], onEditById, onDeleteById, onViewDetailsById, onViewDocument, onDownloadDocument }) => {
    console.log('[PmiTable] Menerima prop pmiData:', pmiData);
    console.log('[PmiTable] Apakah pmiData sebuah Array?', Array.isArray(pmiData));
    
    // Guard clause untuk memastikan data yang diterima adalah array
    if (!Array.isArray(pmiData)) {
        console.error("PmiTable expects pmiData to be an array, but received:", pmiData);
        return <p>Terjadi kesalahan saat menampilkan data.</p>;
    }

    if (pmiData.length === 0) {
        return <p>Belum ada data PMI yang cocok dengan pencarian Anda.</p>
    }

    return (
        <div className="table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>ID PMI</th>
                        <th>Nama</th>
                        <th>Asal (Kec/Desa)</th>
                        <th>Jenis Kelamin</th>
                        <th>Negara Tujuan</th>
                        <th>Dokumen</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {pmiData.map((pmi) => {
                        // Pastikan setiap 'pmi' adalah objek yang valid
                        if (!pmi || typeof pmi !== 'object') return null;

                        return (
                            <tr key={pmi._id}>
                                <td><strong>{pmi.pmiId || 'N/A'}</strong></td>
                                <td>{pmi.nama}</td>
                                <td>{pmi.asal ? `${pmi.asal.kecamatan} / ${pmi.asal.desa}` : 'N/A'}</td>
                                <td>{pmi.jenisKelamin}</td>
                                <td>{pmi.negaraTujuan}</td>
                                <td>
                                    <DocumentSubTable
                                        documents={pmi.dokumen}
                                        pmiId={pmi._id}
                                        onViewDocument={onViewDocument}
                                        onDownloadDocument={onDownloadDocument}
                                    />
                                </td>
                                <td className="actions">
                                    <button
                                        className="view-btn"
                                        onClick={() => onViewDetailsById(pmi)}
                                        style={{ backgroundColor: '#17a2b8', color: 'white', marginBottom: '5px', width: '70px' }}
                                    >
                                        Detail
                                    </button>
                                    <button
                                        className="edit-btn"
                                        onClick={() => onEditById(pmi)}
                                        style={{ backgroundColor: '#ffc107', color: 'black', marginBottom: '5px', width: '70px' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => onDeleteById(pmi._id)}
                                        style={{ width: '70px' }}
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default PmiTable;
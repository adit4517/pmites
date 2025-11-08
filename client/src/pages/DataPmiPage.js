// import React, { useState, useEffect, useContext, useCallback } from 'react';
// import axios from 'axios';
// import { AuthContext } from '../App';
// import PmiTable from '../components/pmi/PmiTable';
// import PmiForm from '../components/pmi/PmiForm';

// // Komponen DocumentLinks sebaiknya di luar atau di file sendiri.
// // Kita perlu meneruskan handleDownload sebagai prop jika dipisah.
// const DocumentLinks = ({ documents, pmiId, onDownload }) => {
//     if (!documents || Object.keys(documents).length === 0) {
//         return <small>Tidak ada dokumen.</small>;
//     }
//     const validDocuments = Object.entries(documents).filter(([key, path]) => path);

//     if (validDocuments.length === 0) {
//         return <small>Tidak ada dokumen terlampir.</small>;
//     }

//     return (
//         <ul>
//                         {validDocuments.map(([key, pathValue]) => { // Ganti nama 'path' menjadi 'pathValue' agar lebih jelas
//                 const fileName = pathValue.split('\\').pop().split('/').pop();
//                 // Pastikan path menggunakan forward slashes untuk URL
//                 const documentUrlPath = pathValue.replace(/\\/g, '/');
//                 // Pastikan URL selalu mengandung 'uploads/' prefix
//                 const urlToOpen = documentUrlPath.startsWith('uploads/')
//                     ? `http://localhost:5000/${documentUrlPath}`
//                     : `http://localhost:5000/uploads/${fileName}`;
//                 return (
//                      <li key={key}>
//                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
//                          {' '}
//                         {/* PERBAIKAN DI SINI */}
//                         <button className="view-btn" onClick={() => window.open(`http://localhost:5000/${documentUrlPath}`, '_blank')}>Lihat</button>
//                         <button className="view-btn" onClick={() => window.open(urlToOpen, '_blank')}>Lihat</button>
//                          {' '}
//                          <button className="download-btn" onClick={() => onDownload(pmiId, key, fileName)}>Download</button>
//                      </li>
//                 );
//             })}

//         </ul>
//     );
// };


// const DataPmiPage = () => {
//     const { state } = useContext(AuthContext);
//     const [pmiData, setPmiData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
    
//     // State untuk Modal Detail (jika masih ingin digunakan terpisah)
//     const [showDetailModal, setShowDetailModal] = useState(false);
//     const [selectedPmi, setSelectedPmi] = useState(null);

//     // State untuk Search dan Modal Edit
//     const [searchTerm, setSearchTerm] = useState('');
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [editingPmi, setEditingPmi] = useState(null);
//     const [editFormData, setEditFormData] = useState({});
//     const [editFileFields, setEditFileFields] = useState({});
//     const [docsToDelete, setDocsToDelete] = useState([]);

//     const fetchPmiData = useCallback(async () => {
//         setLoading(true);
//         setError('');
//         try {
//             const config = {
//                 headers: { 'Authorization': `Bearer ${state.token}` },
//                 params: { search: searchTerm }
//             };
//             const res = await axios.get('http://localhost:5000/api/pmi', config);

//             // TAMBAHKAN BARIS INI UNTUK DEBUGGING
//             console.log('[Frontend] Menerima data dari API:', res.data);

//             setPmiData(res.data);
//         } catch (err) {
//             console.error("Error fetching PMI data:", err);
//             setError('Gagal memuat data PMI.');
//         } finally {
//             setLoading(false);
//         }
//     }, [state.token, searchTerm]);

//     useEffect(() => {
//         const delayDebounceFn = setTimeout(() => {
//             fetchPmiData();
//         }, 500);
//         return () => clearTimeout(delayDebounceFn);
//     }, [fetchPmiData]);

//     const handleView = (pmi) => {
//         setSelectedPmi(pmi);
//         setShowDetailModal(true);
//     };
    
//     // Pindahkan fungsi handleDownload ke scope utama agar bisa diakses oleh DocumentLinks
//     const handleDownload = (pmiId, docField, fileName) => {
//         const downloadUrl = `http://localhost:5000/api/pmi/download/${pmiId}/${docField}`;
//         window.open(downloadUrl, '_blank');
//     };

//     const handleEditClick = (pmi) => {
//         setEditingPmi(pmi);
//         setEditFormData({
//             nama: pmi.nama,
//             asalKecamatan: pmi.asal.kecamatan,
//             asalDesa: pmi.asal.desa,
//             jenisKelamin: pmi.jenisKelamin,
//             negaraTujuan: pmi.negaraTujuan,
//             profesi: pmi.profesi,
//             waktuBerangkat: new Date(pmi.waktuBerangkat).toISOString().split('T')[0],
//         });
//         setEditFileFields({});
//         setDocsToDelete([]);
//         setIsEditModalOpen(true);
//     };

//     const handleEditFormChange = (e) => {
//         const { name, value } = e.target;
//         setEditFormData(prev => {
//             if (name === 'asalKecamatan') {
//                 return { ...prev, asalKecamatan: value, asalDesa: '' };
//             }
//             return { ...prev, [name]: value };
//         });
//     };

//     const handleEditFileChange = (e) => {
//         setEditFileFields({ ...editFileFields, [e.target.name]: e.target.files[0] });
//     };

//     const handleToggleDocToDelete = (docField) => {
//         setDocsToDelete(prev =>
//             prev.includes(docField) ? prev.filter(d => d !== docField) : [...prev, docField]
//         );
//     };

//     const handleUpdateSubmit = async (e) => {
//         e.preventDefault();
//         const dataPayload = new FormData();
//         Object.keys(editFormData).forEach(key => dataPayload.append(key, editFormData[key]));
//         Object.keys(editFileFields).forEach(key => {
//             if (editFileFields[key]) dataPayload.append(key, editFileFields[key]);
//         });
//         if (docsToDelete.length > 0) {
//             dataPayload.append('documentsToDelete', JSON.stringify(docsToDelete));
//         }

//         try {
//             const config = {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                     'Authorization': `Bearer ${state.token}`
//                 },
//             };
//             await axios.put(`http://localhost:5000/api/pmi/${editingPmi._id}`, dataPayload, config);
//             alert('Data berhasil diperbarui!');
//             setIsEditModalOpen(false);
//             fetchPmiData();
//         } catch (err) {
//             console.error("Error updating PMI data:", err);
//             alert('Gagal memperbarui data.');
//         }
//     };

//     const handleDelete = async (id) => {
//         if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
//             try {
//                 const config = { headers: { 'Authorization': `Bearer ${state.token}` } };
//                 await axios.delete(`http://localhost:5000/api/pmi/${id}`, config);
//                 fetchPmiData();
//                 alert('Data PMI berhasil dihapus.');
//             } catch (err) {
//                 console.error("Error deleting PMI data:", err);
//                 alert('Gagal menghapus data PMI.');
//             }
//         }
//     };

//     // TAMBAHKAN BARIS INI UNTUK DEBUGGING
//     console.log('[Frontend] Nilai state pmiData sebelum render:', pmiData);
//     // INI ADALAH SATU-SATUNYA RETURN STATEMENT UNTUK KOMPONEN
//     return (
//         <div>
//             <h1>Data PMI</h1>
            
//             <div className="search-container" style={{ marginBottom: '20px' }}>
//                 <input
//                     type="text"
//                     placeholder="Cari berdasarkan Nama, ID, Asal, Negara, Profesi..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
//                 />
//             </div>

//             {/* Logika untuk menampilkan loading, error, atau tabel data */}
//             {loading ? (
//                 <p>Memuat data...</p>
//             ) : error ? (
//                 <p style={{ color: 'red' }}>{error}</p>
//             ) : (
//                 <PmiTable
//                 pmiData={pmiData}
//                 onDeleteById={handleDelete}
//                 onEditById={handleEditClick}
//                 onViewDetailsById={handleView}
                
//                 />
//             )}

//             {/* Modal untuk Edit Data */}
//             {isEditModalOpen && editingPmi && (
//                 <div className="modal">
//                     <div className="modal-content" style={{maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto'}}>
//                         <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>&times;</button>
//                         <h3>Edit Data: {editingPmi.pmiId} - {editingPmi.nama}</h3>
//                         <PmiForm
//                             formId="editPmiForm"
//                             isEditMode={true}
//                             formData={editFormData}
//                             fileFields={editFileFields}
//                             onFormChange={handleEditFormChange}
//                             onFileChange={handleEditFileChange}
//                             onSubmit={handleUpdateSubmit}
//                             onReset={() => setIsEditModalOpen(false)}
//                         >
//                             <div className="form-section">
//                                 <h4>Dokumen Tersimpan</h4>
//                                 <ul style={{listStyle:'none', padding: 0}}>
//                                     {Object.entries(editingPmi.dokumen).map(([key, path]) => {
//                                         if(path) {
//                                             return (
//                                                 <li key={key} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom:'5px'}}>
//                                                     <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
//                                                     <label style={{color: docsToDelete.includes(key) ? 'red' : 'inherit'}}>
//                                                         <input type="checkbox" checked={docsToDelete.includes(key)} onChange={() => handleToggleDocToDelete(key)} /> Tandai untuk Hapus
//                                                     </label>
//                                                 </li>
//                                             )
//                                         }
//                                         return null;
//                                     })}
//                                 </ul>
//                             </div>
//                         </PmiForm>
//                     </div>
//                 </div>
//             )}

//             {/* Modal untuk Detail Data */}
//             {showDetailModal && selectedPmi && (
//                 <div className="modal">
//                     <div className="modal-content" style={{maxWidth: '700px', maxHeight: '80vh', overflowY: 'auto'}}>
//                         <button className="close-btn" onClick={() => setShowDetailModal(false)}>&times;</button>
//                         <h4>Detail Data PMI: {selectedPmi.nama}</h4>
//                         <p><strong>ID PMI:</strong> {selectedPmi.pmiId}</p>
//                         <p><strong>Nama:</strong> {selectedPmi.nama}</p>
//                         <p><strong>Asal:</strong> {selectedPmi.asal.kecamatan}, {selectedPmi.asal.desa}</p>
//                         <p><strong>Jenis Kelamin:</strong> {selectedPmi.jenisKelamin}</p>
//                         <p><strong>Negara Tujuan:</strong> {selectedPmi.negaraTujuan}</p>
//                         <p><strong>Profesi:</strong> {selectedPmi.profesi}</p>
//                         <p><strong>Waktu Berangkat:</strong> {new Date(selectedPmi.waktuBerangkat).toLocaleDateString('id-ID')}</p>
//                         <h5>Dokumen:</h5>
//                         <DocumentLinks documents={selectedPmi.dokumen} pmiId={selectedPmi._id} onDownload={handleDownload} />
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default DataPmiPage;

import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../App';
import PmiTable from '../components/pmi/PmiTable';
import PmiForm from '../components/pmi/PmiForm';

// Komponen DocumentLinks sebaiknya di luar atau di file sendiri.
// Kita perlu meneruskan handleDownload sebagai prop jika dipisah.
const DocumentLinks = ({ documents, pmiId, onDownload }) => {
    if (!documents || Object.keys(documents).length === 0) {
        return <small>Tidak ada dokumen.</small>;
    }
    const validDocuments = Object.entries(documents).filter(([key, path]) => path);

    if (validDocuments.length === 0) {
        return <small>Tidak ada dokumen terlampir.</small>;
    }

    return (
        <ul>
            {validDocuments.map(([key, path]) => {
                const fileName = path.split('\\').pop().split('/').pop();
                return (
                    <li key={key}>
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                        {' '}
                        <button className="view-btn" onClick={() => window.open(`http://localhost:5000/${path}`, '_blank')}>Lihat</button>
                        {' '}
                        {/* Panggil fungsi onDownload yang diteruskan dari parent */}
                        <button className="download-btn" onClick={() => onDownload(pmiId, key, fileName)}>Download</button>
                    </li>
                );
            })}
        </ul>
    );
};

const DataPmiPage = () => {
    const { state } = useContext(AuthContext);
    const [pmiData, setPmiData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // State untuk Modal Detail (jika masih ingin digunakan terpisah)
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedPmi, setSelectedPmi] = useState(null);

    // State untuk Search dan Modal Edit
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPmi, setEditingPmi] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [editFileFields, setEditFileFields] = useState({});
    const [docsToDelete, setDocsToDelete] = useState([]);

    const fetchPmiData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const config = {
                headers: { 'Authorization': `Bearer ${state.token}` },
                params: { search: searchTerm }
            };
            const res = await axios.get('http://localhost:5000/api/pmi', config);

            // TAMBAHKAN BARIS INI UNTUK DEBUGGING
            console.log('[Frontend] Menerima data dari API:', res.data);

            setPmiData(res.data);
        } catch (err) {
            console.error("Error fetching PMI data:", err);
            setError('Gagal memuat data PMI.');
        } finally {
            setLoading(false);
        }
    }, [state.token, searchTerm]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchPmiData();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [fetchPmiData]);

    const handleView = (pmi) => {
        setSelectedPmi(pmi);
        setShowDetailModal(true);
    };
    
    // Pindahkan fungsi handleDownload ke scope utama agar bisa diakses oleh DocumentLinks
    const handleDownload = (pmiId, docField, fileName) => {
        const downloadUrl = `http://localhost:5000/api/pmi/download/${pmiId}/${docField}`;
        window.open(downloadUrl, '_blank');
    };

    const handleEditClick = (pmi) => {
        setEditingPmi(pmi);
        setEditFormData({
            nama: pmi.nama,
            asalKecamatan: pmi.asal.kecamatan,
            asalDesa: pmi.asal.desa,
            jenisKelamin: pmi.jenisKelamin,
            negaraTujuan: pmi.negaraTujuan,
            profesi: pmi.profesi,
            waktuBerangkat: new Date(pmi.waktuBerangkat).toISOString().split('T')[0],
        });
        setEditFileFields({});
        setDocsToDelete([]);
        setIsEditModalOpen(true);
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => {
            if (name === 'asalKecamatan') {
                return { ...prev, asalKecamatan: value, asalDesa: '' };
            }
            return { ...prev, [name]: value };
        });
    };

    const handleEditFileChange = (e) => {
        setEditFileFields({ ...editFileFields, [e.target.name]: e.target.files[0] });
    };

    const handleToggleDocToDelete = (docField) => {
        setDocsToDelete(prev =>
            prev.includes(docField) ? prev.filter(d => d !== docField) : [...prev, docField]
        );
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const dataPayload = new FormData();
        Object.keys(editFormData).forEach(key => dataPayload.append(key, editFormData[key]));
        Object.keys(editFileFields).forEach(key => {
            if (editFileFields[key]) dataPayload.append(key, editFileFields[key]);
        });
        if (docsToDelete.length > 0) {
            dataPayload.append('documentsToDelete', JSON.stringify(docsToDelete));
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${state.token}`
                },
            };
            await axios.put(`http://localhost:5000/api/pmi/${editingPmi._id}`, dataPayload, config);
            alert('Data berhasil diperbarui!');
            setIsEditModalOpen(false);
            fetchPmiData();
        } catch (err) {
            console.error("Error updating PMI data:", err);
            alert('Gagal memperbarui data.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            try {
                const config = { headers: { 'Authorization': `Bearer ${state.token}` } };
                await axios.delete(`http://localhost:5000/api/pmi/${id}`, config);
                fetchPmiData();
                alert('Data PMI berhasil dihapus.');
            } catch (err) {
                console.error("Error deleting PMI data:", err);
                alert('Gagal menghapus data PMI.');
            }
        }
    };

    // TAMBAHKAN BARIS INI UNTUK DEBUGGING
    console.log('[Frontend] Nilai state pmiData sebelum render:', pmiData);
    // INI ADALAH SATU-SATUNYA RETURN STATEMENT UNTUK KOMPONEN
    return (
        <div>
            <h1>Data PMI</h1>
            
            <div className="search-container" style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Cari berdasarkan Nama, ID, Asal, Negara, Profesi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
                />
            </div>

            {/* Logika untuk menampilkan loading, error, atau tabel data */}
            {loading ? (
                <p>Memuat data...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <PmiTable
                pmiData={pmiData}
                onDeleteById={handleDelete}
                onEditById={handleEditClick}
                onViewDetailsById={handleView}
                onViewDocument={(path) => window.open(`http://localhost:5000/${path}`, '_blank')}
                onDownloadDocument={handleDownload} // handleDownload sudah ada di file ini
                />
            )}

            {/* Modal untuk Edit Data */}
            {isEditModalOpen && editingPmi && (
                <div className="modal">
                    <div className="modal-content" style={{maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto'}}>
                        <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>&times;</button>
                        <h3>Edit Data: {editingPmi.pmiId} - {editingPmi.nama}</h3>
                        <PmiForm
                            formId="editPmiForm"
                            isEditMode={true}
                            formData={editFormData}
                            fileFields={editFileFields}
                            onFormChange={handleEditFormChange}
                            onFileChange={handleEditFileChange}
                            onSubmit={handleUpdateSubmit}
                            onReset={() => setIsEditModalOpen(false)}
                        >
                            <div className="form-section">
                                <h4>Dokumen Tersimpan</h4>
                                <ul style={{listStyle:'none', padding: 0}}>
                                    {Object.entries(editingPmi.dokumen).map(([key, path]) => {
                                        if(path) {
                                            return (
                                                <li key={key} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom:'5px'}}>
                                                    <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                                                    <label style={{color: docsToDelete.includes(key) ? 'red' : 'inherit'}}>
                                                        <input type="checkbox" checked={docsToDelete.includes(key)} onChange={() => handleToggleDocToDelete(key)} /> Tandai untuk Hapus
                                                    </label>
                                                </li>
                                            )
                                        }
                                        return null;
                                    })}
                                </ul>
                            </div>
                        </PmiForm>
                    </div>
                </div>
            )}

            {/* Modal untuk Detail Data */}
            {showDetailModal && selectedPmi && (
                <div className="modal">
                    <div className="modal-content" style={{maxWidth: '700px', maxHeight: '80vh', overflowY: 'auto'}}>
                        <button className="close-btn" onClick={() => setShowDetailModal(false)}>&times;</button>
                        <h4>Detail Data PMI: {selectedPmi.nama}</h4>
                        <p><strong>ID PMI:</strong> {selectedPmi.pmiId}</p>
                        <p><strong>Nama:</strong> {selectedPmi.nama}</p>
                        <p><strong>Asal:</strong> {selectedPmi.asal.kecamatan}, {selectedPmi.asal.desa}</p>
                        <p><strong>Jenis Kelamin:</strong> {selectedPmi.jenisKelamin}</p>
                        <p><strong>Negara Tujuan:</strong> {selectedPmi.negaraTujuan}</p>
                        <p><strong>Profesi:</strong> {selectedPmi.profesi}</p>
                        <p><strong>Waktu Berangkat:</strong> {new Date(selectedPmi.waktuBerangkat).toLocaleDateString('id-ID')}</p>
                        <h5>Dokumen:</h5>
                        <DocumentLinks documents={selectedPmi.dokumen} pmiId={selectedPmi._id} onDownload={handleDownload} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataPmiPage;
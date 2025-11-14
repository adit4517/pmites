import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../App';
import PmiForm from '../../components/pmi/PmiForm'; // Impor PmiForm

// Komponen Notifikasi, ini sudah benar.
const Notification = ({ message, type, onDismiss }) => {
    if (!message) return null;
    return (
        <div className={`notification ${type}`} onClick={onDismiss} style={{cursor: 'pointer'}}>
            {message}
            <button onClick={onDismiss} style={{marginLeft: '10px', background: 'none', border: 'none', color: 'white', float: 'right'}}>&times;</button>
        </div>
    );
};


const InputPmiPage = () => {
    const { state } = useContext(AuthContext);

    // Initial state untuk form, ini sudah benar.
    const initialFormData = {
        nama: '',
        asalKecamatan: '',
        asalDesa: '',
        jenisKelamin: 'Laki-laki', // Beri nilai awal yang valid
        negaraTujuan: '',
        profesi: '',
        waktuBerangkat: '',
    };
    const initialFileFields = {
        suratPerjanjian: null,
        rekomendasiPaspor: null,
        izinPerekrutan: null,
        tugasPendampingan: null,
        ktpPmi: null,
        kk: null,
        akta: null,
        bukuNikah: null,
        ijazah: null,
        izinKeluarga: null,
        sertifikatKeterampilan: null,
        dokumenLainnya: null,
    };

    const [formData, setFormData] = useState(initialFormData);
    const [fileFields, setFileFields] = useState(initialFileFields);
    const [notification, setNotification] = useState({ message: '', type: '' });

    // Gunakan handler ini. Ini sudah menangani reset desa.
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            if (name === 'asalKecamatan') {
                return { ...prev, asalKecamatan: value, asalDesa: '' };
            }
            return { ...prev, [name]: value };
        });
    };

    const handleFileChange = (e) => {
        setFileFields({ ...fileFields, [e.target.name]: e.target.files[0] });
    };

    // Fungsi notifikasi, sudah benar.
    const clearNotification = () => setNotification({ message: '', type: '' });
    const showNotification = (message, type, duration = 3000) => {
        setNotification({ message, type });
        setTimeout(clearNotification, duration);
    };

    // Fungsi handleReset, pastikan id "pmiForm" ada di komponen PmiForm.js
    const handleReset = () => {
        setFormData(initialFormData);
        setFileFields(initialFileFields);
        if (document.getElementById("pmiForm")) {
            document.getElementById("pmiForm").reset();
        }
    };

    // Fungsi handleSubmit dengan penanganan error, ini sudah benar.
    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataPayload = new FormData();

        for (const key in formData) {
            dataPayload.append(key, formData[key]);
        }
        for (const key in fileFields) {
            if (fileFields[key]) {
                dataPayload.append(key, fileFields[key]);
            }
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${state.token}`
                },
            };
            const res = await axios.post('http://localhost:5000/api/pmi', dataPayload, config);
            showNotification(res.data.msg || 'Input data PMI berhasil!', 'success');
            handleReset();
        } catch (err) {
            console.error("Error submitting form:", err.response ? err.response.data : err);
            let displayMessage = 'Gagal menyimpan data. Periksa kembali isian Anda.';

            if (err.response && err.response.data) {
                const errorDataMsg = err.response.data.msg;
                if (typeof errorDataMsg === 'string') {
                    displayMessage = errorDataMsg;
                } else if (typeof errorDataMsg === 'object' && errorDataMsg !== null) {
                    if (typeof errorDataMsg.message === 'string') {
                        displayMessage = errorDataMsg.message;
                        if (errorDataMsg.field) {
                            displayMessage += ` (Field: ${errorDataMsg.field})`;
                        }
                    } else if (errorDataMsg.name) {
                        displayMessage = `Error: ${errorDataMsg.name}`;
                    }
                } else if (typeof err.response.data.message === 'string') {
                    displayMessage = err.response.data.message;
                }
            } else if (err.message) {
                displayMessage = err.message;
            }
            showNotification(displayMessage, 'error');
        }
    };

    // Bagian return, ini yang paling penting untuk diperbaiki.
    return (
        <div>
            <Notification message={notification.message} type={notification.type} onDismiss={clearNotification} />
            <h1>Input Data PMI</h1>
            
            {/* HANYA PANGGIL KOMPONEN PmiForm DI SINI */}
            {/* JANGAN TULIS ULANG TAG <form> ... </form> */}
            <PmiForm
                formId="pmiForm" // <-- Berikan id di sini agar handleReset berfungsi
                formData={formData}
                fileFields={fileFields}
                onFormChange={handleFormChange}
                onFileChange={handleFileChange}
                onSubmit={handleSubmit}
                onReset={handleReset}
                isEditMode={false}
            />
        </div>
    );
};

export default InputPmiPage;
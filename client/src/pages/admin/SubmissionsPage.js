// File: client/src/pages/admin/SubmissionsPage.js

import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../App";
import axios from "axios";

const SubmissionsPage = () => {
  const { state } = useContext(AuthContext);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(""); // 'approve', 'reject', 'revision'
  const [actionNote, setActionNote] = useState("");
  const [statusFilter, setStatusFilter] = useState("submitted");
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  const fetchSubmissions = React.useCallback(async () => {
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${state.token}` },
        params: {
          status: statusFilter === "all" ? "" : statusFilter,
          search: searchTerm,
        },
      };
      const res = await axios.get(
        "http://localhost:5000/api/pmi/submissions",
        config
      );
      setSubmissions(res.data.submissions);
    } catch (err) {
      console.error("Error fetching submissions:", err);
      showNotification("Gagal memload data", "error");
    } finally {
      setLoading(false);
    }
  }, [state.token, statusFilter, searchTerm]);

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter, searchTerm, state.token, fetchSubmissions]);

  const showNotification = (message, type) => {
    setNotification({ show: true, type, message });
    setTimeout(
      () => setNotification({ show: false, type: "", message: "" }),
      3000
    );
  };

  const handleViewDetail = (submission) => {
    setSelectedSubmission(submission);
    setShowDetailModal(true);
  };

  const handleActionClick = (submission, type) => {
    setSelectedSubmission(submission);
    setActionType(type);
    setActionNote("");
    setShowActionModal(true);
  };

  const handleSubmitAction = async () => {
    if (
      actionType === "approve" ||
      actionType === "reject" ||
      actionType === "revision"
    ) {
      if (
        !actionNote.trim() &&
        (actionType === "reject" || actionType === "revision")
      ) {
        showNotification("Catatan harus diisi", "error");
        return;
      }

      try {
        const config = {
          headers: { Authorization: `Bearer ${state.token}` },
        };

        let statusData = {};
        if (actionType === "approve") {
          statusData = {
            status: "approved",
            note: actionNote || "Aplikasi disetujui",
          };
        } else if (actionType === "reject") {
          statusData = {
            status: "rejected",
            note: actionNote,
            rejectionReason: actionNote,
          };
        } else if (actionType === "revision") {
          statusData = {
            status: "need_revision",
            note: actionNote,
            revisionNotes: actionNote,
          };
        }

        console.log("Sending status update:", statusData); // Debug log

        await axios.put(
          `http://localhost:5000/api/pmi/${selectedSubmission._id}/status`,
          statusData,
          config
        );

        showNotification("Status berhasil diupdate", "success");
        setShowActionModal(false);
        setActionNote("");
        fetchSubmissions();
      } catch (err) {
        console.error("Error updating status:", err);
        const errorMsg =
          err.response?.data?.msg ||
          err.response?.data?.message ||
          "Gagal update status";
        showNotification(errorMsg, "error");
      }
    }
  };

  const handleViewDocument = (path) => {
    window.open(`http://localhost:5000/${path}`, "_blank");
  };

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "download";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const getFilenameFromDisposition = (disposition, fallbackName) => {
    if (!disposition) return fallbackName;
    const filenameMatch = disposition.match(
      /filename\*=UTF-8''(.+)|filename=\"?([^\";]+)\"?/
    );
    if (filenameMatch) {
      // support RFC5987 and normal filename
      return decodeURIComponent(filenameMatch[1] || filenameMatch[2]);
    }
    return fallbackName;
  };

  // Mengunduh file (mengirim Authorization header)
  const handleDownloadDocument = async (
    pmiId,
    docField,
    fallbackName = "document"
  ) => {
    if (!state?.token) {
      alert("Token tidak ditemukan. Silakan login ulang.");
      return;
    }

    const downloadUrl = `http://localhost:5000/api/pmi/download/${pmiId}/${docField}`;
    try {
      const res = await axios.get(downloadUrl, {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
        responseType: "blob",
      });

      // Coba ambil filename dari header
      const disposition =
        res.headers["content-disposition"] ||
        res.headers["Content-Disposition"];
      const filename = getFilenameFromDisposition(
        disposition,
        `${fallbackName}`
      );

      downloadBlob(res.data, filename);
    } catch (err) {
      console.error("Error downloading file:", err);
      const msg = err.response?.data?.msg || err.response?.data || err.message;
      alert("Gagal mengunduh: " + msg);
    }
  };

  const getStatusBadgeClass = (status) => {
    const colors = {
      submitted: "background: #3498db; color: white;",
      under_review: "background: #f39c12; color: white;",
      need_revision: "background: #e67e22; color: white;",
      approved: "background: #2ecc71; color: white;",
      rejected: "background: #e74c3c; color: white;",
    };
    return colors[status] || "background: #95a5a6; color: white;";
  };

  return (
    <div>
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
          <button
            onClick={() =>
              setNotification({ show: false, type: "", message: "" })
            }
          >
            &times;
          </button>
        </div>
      )}

      <div className="dashboard-header">
        <h1>Review Aplikasi PMI</h1>
      </div>

      {/* Filter & Search */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <div className="filter-container">
          <label>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "8px 12px" }}
          >
            <option value="all">Semua</option>
            <option value="submitted">Menunggu Review</option>
            <option value="under_review">Sedang Direview</option>
            <option value="need_revision">Perlu Revisi</option>
            <option value="approved">Disetujui</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>

        <div style={{ flex: 1, minWidth: "300px" }}>
          <input
            type="text"
            placeholder="Cari berdasarkan nama, ID, atau asal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--border-radius-sm)",
            }}
          />
        </div>
      </div>

      {/* Submissions List */}
      {loading ? (
        <p>Memuat data...</p>
      ) : submissions.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "white",
            borderRadius: "8px",
          }}
        >
          <div style={{ fontSize: "4em", marginBottom: "20px" }}>📋</div>
          <h3>Tidak ada aplikasi</h3>
          <p style={{ color: "var(--text-secondary)" }}>
            Belum ada aplikasi PMI yang perlu direview
          </p>
        </div>
      ) : (
        <div className="dashboard-grid">
          {submissions.map((submission) => (
            <div key={submission._id} className="dashboard-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "15px",
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 5px 0" }}>{submission.nama}</h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.9em",
                      color: "var(--text-secondary)",
                    }}
                  >
                    ID: {submission.pmiId}
                  </p>
                </div>
                <div
                  style={{
                    padding: "5px 12px",
                    borderRadius: "20px",
                    fontSize: "0.85em",
                    fontWeight: "600",
                    ...Object.fromEntries(
                      getStatusBadgeClass(submission.status)
                        .split(";")
                        .map((style) =>
                          style
                            .trim()
                            .split(":")
                            .map((s) => s.trim())
                        )
                    ),
                  }}
                >
                  {submission.statusLabel}
                </div>
              </div>

              <div style={{ fontSize: "0.9em", marginBottom: "15px" }}>
                <p style={{ margin: "5px 0" }}>
                  <strong>Asal:</strong> {submission.asal.kecamatan},{" "}
                  {submission.asal.desa}
                </p>
                <p style={{ margin: "5px 0" }}>
                  <strong>Negara Tujuan:</strong> {submission.negaraTujuan}
                </p>
                <p style={{ margin: "5px 0" }}>
                  <strong>Profesi:</strong> {submission.profesi}
                </p>
                <p style={{ margin: "5px 0" }}>
                  <strong>Disubmit:</strong>{" "}
                  {submission.submittedAt
                    ? new Date(submission.submittedAt).toLocaleDateString(
                        "id-ID"
                      )
                    : "-"}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  paddingTop: "15px",
                  borderTop: "1px solid #eee",
                }}
              >
                <button
                  className="view-btn"
                  onClick={() => handleViewDetail(submission)}
                  style={{ flex: 1, minWidth: "100px" }}
                >
                  Detail
                </button>

                {submission.status === "submitted" && (
                  <>
                    <button
                      className="submit-btn"
                      onClick={() => handleActionClick(submission, "approve")}
                      style={{ flex: 1, minWidth: "100px" }}
                    >
                      ✓ Setujui
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => handleActionClick(submission, "revision")}
                      style={{ flex: 1, minWidth: "100px" }}
                    >
                      ↻ Revisi
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleActionClick(submission, "reject")}
                      style={{ flex: 1, minWidth: "100px" }}
                    >
                      ✗ Tolak
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedSubmission && (
        <div className="modal">
          <div
            className="modal-content"
            style={{ maxWidth: "800px", maxHeight: "90vh", overflowY: "auto" }}
          >
            <button
              className="close-btn"
              onClick={() => setShowDetailModal(false)}
            >
              &times;
            </button>

            <h3>Detail Aplikasi: {selectedSubmission.nama}</h3>

            <div style={{ marginTop: "20px" }}>
              <div className="form-section">
                <h4>Data Diri</h4>
                <p>
                  <strong>ID PMI:</strong> {selectedSubmission.pmiId}
                </p>
                <p>
                  <strong>Nama:</strong> {selectedSubmission.nama}
                </p>
                <p>
                  <strong>Asal:</strong> {selectedSubmission.asal.kecamatan},{" "}
                  {selectedSubmission.asal.desa}
                </p>
                <p>
                  <strong>Jenis Kelamin:</strong>{" "}
                  {selectedSubmission.jenisKelamin}
                </p>
                <p>
                  <strong>Pendidikan:</strong>{" "}
                  {selectedSubmission.pendidikanTerakhir}
                </p>
                {selectedSubmission.keterampilan &&
                  selectedSubmission.keterampilan.length > 0 && (
                    <p>
                      <strong>Keterampilan:</strong>{" "}
                      {selectedSubmission.keterampilan.join(", ")}
                    </p>
                  )}
              </div>

              <div className="form-section">
                <h4>Data Keberangkatan</h4>
                <p>
                  <strong>Negara Tujuan:</strong>{" "}
                  {selectedSubmission.negaraTujuan}
                </p>
                <p>
                  <strong>Profesi:</strong> {selectedSubmission.profesi}
                </p>
                <p>
                  <strong>Rencana Berangkat:</strong>{" "}
                  {new Date(
                    selectedSubmission.waktuBerangkat
                  ).toLocaleDateString("id-ID")}
                </p>
              </div>

              <div className="form-section">
                <h4>Dokumen Terupload</h4>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Nama Dokumen</th>
                        <th>Status</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(selectedSubmission.dokumen).map(
                        ([key, path]) => (
                          <tr key={key}>
                            <td>
                              {key
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())}
                            </td>
                            <td>
                              {path ? (
                                <span
                                  style={{
                                    color: "var(--success-color)",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ✓ Ada
                                </span>
                              ) : (
                                <span style={{ color: "var(--error-color)" }}>
                                  ✗ Belum
                                </span>
                              )}
                            </td>
                            <td>
                              {path && (
                                <>
                                  <button
                                    className="view-btn"
                                    onClick={() => handleViewDocument(path)}
                                    style={{ marginRight: "5px" }}
                                  >
                                    Lihat
                                  </button>
                                  <button
                                    className="download-btn"
                                    onClick={() =>
                                      handleDownloadDocument(
                                        selectedSubmission._id,
                                        key,
                                        key
                                      )
                                    }
                                  >
                                    Unduh
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && selectedSubmission && (
        <div className="modal">
          <div className="modal-content" style={{ maxWidth: "500px" }}>
            <button
              className="close-btn"
              onClick={() => setShowActionModal(false)}
            >
              &times;
            </button>

            <h3>
              {actionType === "approve" && "Setujui Aplikasi"}
              {actionType === "reject" && "Tolak Aplikasi"}
              {actionType === "revision" && "Minta Revisi"}
            </h3>

            <p style={{ marginBottom: "15px", color: "var(--text-secondary)" }}>
              Aplikasi: <strong>{selectedSubmission.nama}</strong> (
              {selectedSubmission.pmiId})
            </p>

            <div className="form-group">
              <label>
                {actionType === "approve" && "Catatan (Opsional)"}
                {actionType === "reject" && "Alasan Penolakan *"}
                {actionType === "revision" && "Catatan Revisi *"}
              </label>
              <textarea
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                rows={4}
                placeholder={
                  actionType === "approve"
                    ? "Masukkan catatan tambahan (opsional)..."
                    : "Jelaskan alasan atau bagian yang perlu diperbaiki..."
                }
                required={actionType !== "approve"}
              />
            </div>

            <div className="form-buttons">
              <button
                className={
                  actionType === "approve"
                    ? "submit-btn"
                    : actionType === "revision"
                    ? "edit-btn"
                    : "delete-btn"
                }
                onClick={handleSubmitAction}
              >
                {actionType === "approve" && "Setujui"}
                {actionType === "reject" && "Tolak"}
                {actionType === "revision" && "Kirim Revisi"}
              </button>
              <button
                className="reset-btn"
                onClick={() => setShowActionModal(false)}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionsPage;
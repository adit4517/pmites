// File: client/src/pages/user/UserDashboard.js

import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../App";
import PmiCard from "../../components/user/PmiCard";
import axios from "axios";

const UserDashboard = () => {
  const { state } = useContext(AuthContext);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showPmiCard, setShowPmiCard] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${state.token}` },
        };
        const res = await axios.get(
          "http://localhost:5000/api/auth/me",
          config
        );
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    const fetchApplication = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${state.token}` },
        };
        const res = await axios.get(
          "http://localhost:5000/api/pmi/my-application",
          config
        );
        setApplication(res.data.pmi);
      } catch (err) {
        console.log("No application yet");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchApplication();
  }, [state.token]);

  const getStatusBadgeClass = (status) => {
    const statusColors = {
      draft: "background: #95a5a6; color: white;",
      submitted: "background: #3498db; color: white;",
      under_review: "background: #f39c12; color: white;",
      need_revision: "background: #e67e22; color: white;",
      approved: "background: #2ecc71; color: white;",
      rejected: "background: #e74c3c; color: white;",
      processing: "background: #9b59b6; color: white;",
      departed: "background: #1abc9c; color: white;",
      returned: "background: #34495e; color: white;",
    };
    return statusColors[status] || "background: #95a5a6; color: white;";
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p>Memuat data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="dashboard-header">
        <h1>Dashboard PMI</h1>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span
            style={{
              padding: "8px 16px",
              background: "var(--accent-color)",
              color: "white",
              borderRadius: "20px",
              fontSize: "0.9em",
            }}
          >
            {user?.profile?.fullName || "User"}
          </span>
        </div>
      </div>

      {/* Welcome Section */}
      <div
        className="dashboard-card"
        style={{
          background:
            "linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)",
          color: "white",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ color: "white", marginTop: 0 }}>
          Selamat Datang, {user?.profile?.fullName}!
        </h2>
        <p style={{ fontSize: "1.1em", marginBottom: "20px", opacity: 0.9 }}>
          {application
            ? `Status aplikasi Anda saat ini: ${application.statusLabel}`
            : "Anda belum memiliki aplikasi PMI. Mulai pengajuan sekarang!"}
        </p>
        {!application && (
          <Link
            to="/user/application/create"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              background: "white",
              color: "var(--primary-color)",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
              marginTop: "10px",
            }}
          >
            Buat Aplikasi PMI Sekarang
          </Link>
        )}
      </div>

      <div className="dashboard-grid">
        {/* Status Aplikasi Card */}
        {application ? (
          <>
            <div className="dashboard-card">
              <h3>Status Aplikasi</h3>
              <div style={{ marginTop: "20px" }}>
                <div
                  style={{
                    padding: "15px",
                    borderRadius: "8px",
                    ...Object.fromEntries(
                      getStatusBadgeClass(application.status)
                        .split(";")
                        .map((style) =>
                          style
                            .trim()
                            .split(":")
                            .map((s) => s.trim())
                        )
                    ),
                    marginBottom: "15px",
                    textAlign: "center",
                    fontSize: "1.2em",
                    fontWeight: "bold",
                  }}
                >
                  {application.statusLabel}
                </div>
                <div
                  style={{ fontSize: "0.9em", color: "var(--text-secondary)" }}
                >
                  <p>
                    <strong>ID PMI:</strong> {application.pmiId}
                  </p>
                  <p>
                    <strong>Tanggal Dibuat:</strong>{" "}
                    {new Date(application.createdAt).toLocaleDateString(
                      "id-ID"
                    )}
                  </p>
                  {application.submittedAt && (
                    <p>
                      <strong>Tanggal Submit:</strong>{" "}
                      {new Date(application.submittedAt).toLocaleDateString(
                        "id-ID"
                      )}
                    </p>
                  )}
                  {application.approvedAt && (
                    <p>
                      <strong>Disetujui:</strong>{" "}
                      {new Date(application.approvedAt).toLocaleDateString(
                        "id-ID"
                      )}
                    </p>
                  )}
                </div>
                <Link
                  to="/user/application/status"
                  className="view-btn"
                  style={{
                    display: "block",
                    marginTop: "15px",
                    textAlign: "center",
                    textDecoration: "none",
                  }}
                >
                  Lihat Detail
                </Link>

                {/* Tombol Cetak Kartu - hanya muncul jika approved */}
                {application.status === "approved" && (
                  <button
                    className="submit-btn"
                    onClick={() => setShowPmiCard(true)}
                    style={{
                      display: "block",
                      marginTop: "10px",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    🎫 Cetak Kartu PMI
                  </button>
                )}
              </div>
            </div>

            {/* Kelengkapan Dokumen */}
            <div className="dashboard-card">
              <h3>Kelengkapan Dokumen</h3>
              <div style={{ marginTop: "20px" }}>
                <div
                  style={{
                    width: "100%",
                    height: "150px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      border: "8px solid var(--accent-color)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2em",
                      fontWeight: "bold",
                      color: "var(--accent-color)",
                    }}
                  >
                    {application.documentCompleteness?.percentage || 0}%
                  </div>
                </div>
                <p
                  style={{
                    textAlign: "center",
                    marginTop: "10px",
                    color: "var(--text-secondary)",
                  }}
                >
                  {application.documentCompleteness?.completed || 0} dari{" "}
                  {application.documentCompleteness?.total || 0} dokumen wajib
                </p>
                {["draft", "need_revision"].includes(application.status) && (
                  <Link
                    to="/user/application/edit"
                    className="edit-btn"
                    style={{
                      display: "block",
                      marginTop: "15px",
                      textAlign: "center",
                      textDecoration: "none",
                    }}
                  >
                    Edit Aplikasi
                  </Link>
                )}
              </div>
            </div>

            {/* Catatan/Pesan */}
            {(application.revisionNotes || application.rejectionReason) && (
              <div className="dashboard-card" style={{ gridColumn: "1 / -1" }}>
                <h3>
                  {application.status === "rejected"
                    ? "Alasan Penolakan"
                    : "Catatan Revisi"}
                </h3>
                <div
                  style={{
                    padding: "15px",
                    background:
                      application.status === "rejected" ? "#fee" : "#fef3cd",
                    borderLeft: `4px solid ${
                      application.status === "rejected"
                        ? "var(--error-color)"
                        : "var(--warning-color)"
                    }`,
                    borderRadius: "4px",
                    marginTop: "10px",
                  }}
                >
                  <p style={{ margin: 0 }}>
                    {application.revisionNotes || application.rejectionReason}
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div
            className="dashboard-card"
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "60px 20px",
            }}
          >
            <div style={{ fontSize: "4em", marginBottom: "20px" }}>📋</div>
            <h3>Belum Ada Aplikasi</h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "20px" }}>
              Anda belum membuat aplikasi untuk menjadi PMI.
            </p>
          </div>
        )}

        {/* Informasi Profil */}
        <div className="dashboard-card">
          <h3>Informasi Profil</h3>
          <div style={{ marginTop: "15px", fontSize: "0.9em" }}>
            <p>
              <strong>Nama:</strong> {user?.profile?.fullName}
            </p>
            <p>
              <strong>NIK:</strong> {user?.profile?.nik}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Telepon:</strong> {user?.profile?.phone}
            </p>
            <p>
              <strong>Jenis Kelamin:</strong> {user?.profile?.gender}
            </p>
            <Link
              to="/user/profile"
              className="view-btn"
              style={{
                display: "block",
                marginTop: "15px",
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              Edit Profil
            </Link>
          </div>
        </div>

        {/* Menu Cepat */}
      </div>

      {/* Modal Kartu PMI */}
      {showPmiCard && application && (
        <PmiCard
          pmiData={{ ...application, user }}
          onClose={() => setShowPmiCard(false)}
        />
      )}
    </div>
  );
};

export default UserDashboard;

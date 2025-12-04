// File: client/src/pages/user/UserProfilePage.js

import React, { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../../App";
import axios from "axios";

const UserProfile = () => {
  const { state } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: {
      province: "Jawa Tengah",
      regency: "Rembang",
      district: "",
      village: "",
      fullAddress: "",
    },
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  const fetchUserData = useCallback(async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${state.token}` },
      };
      const res = await axios.get("http://localhost:5000/api/auth/me", config);
      setUser(res.data.user);
      setFormData({
        fullName: res.data.user.profile.fullName,
        phone: res.data.user.profile.phone,
        dateOfBirth: new Date(res.data.user.profile.dateOfBirth)
          .toISOString()
          .split("T")[0],
        gender: res.data.user.profile.gender,
        address: res.data.user.profile.address || {
          province: "Jawa Tengah",
          regency: "Rembang",
          district: "",
          village: "",
          fullAddress: "",
        },
      });

      // Set profile picture preview
      if (res.data.user.profile.profilePicture) {
        setProfilePicturePreview(
          `http://localhost:5000/${res.data.user.profile.profilePicture}`
        );
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  }, [state.token]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setNotification({
          show: true,
          type: "error",
          message: "Ukuran file maksimal 2MB",
        });
        setTimeout(
          () => setNotification({ show: false, type: "", message: "" }),
          5000
        );
        return;
      }

      // Validate file type
      if (!file.type.match("image.*")) {
        setNotification({
          show: true,
          type: "error",
          message: "File harus berupa gambar",
        });
        setTimeout(
          () => setNotification({ show: false, type: "", message: "" }),
          5000
        );
        return;
      }

      setProfilePicture(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${state.token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const updateData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "address") {
          updateData.append("address", JSON.stringify(formData.address));
        } else {
          updateData.append(key, formData[key]);
        }
      });

      if (profilePicture) {
        updateData.append("profilePicture", profilePicture);
      }

      await axios.put(
        "http://localhost:5000/api/auth/profile",
        updateData,
        config
      );

      setNotification({
        show: true,
        type: "success",
        message: "Profil berhasil diupdate!",
      });

      setEditing(false);
      setProfilePicture(null);
      fetchUserData();

      setTimeout(
        () => setNotification({ show: false, type: "", message: "" }),
        3000
      );
    } catch (err) {
      setNotification({
        show: true,
        type: "error",
        message: err.response?.data?.msg || "Gagal update profil",
      });
      setTimeout(
        () => setNotification({ show: false, type: "", message: "" }),
        5000
      );
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setNotification({
        show: true,
        type: "error",
        message: "Password baru tidak cocok",
      });
      setTimeout(
        () => setNotification({ show: false, type: "", message: "" }),
        5000
      );
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${state.token}` },
      };
      await axios.put(
        "http://localhost:5000/api/auth/change-password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        config
      );

      setNotification({
        show: true,
        type: "success",
        message: "Password berhasil diubah!",
      });

      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(
        () => setNotification({ show: false, type: "", message: "" }),
        3000
      );
    } catch (err) {
      setNotification({
        show: true,
        type: "error",
        message: err.response?.data?.msg || "Gagal mengubah password",
      });
      setTimeout(
        () => setNotification({ show: false, type: "", message: "" }),
        5000
      );
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p>Memuat data...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "0" }}>
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

      <h1
        style={{ marginBottom: "20px", fontSize: "clamp(1.5rem, 5vw, 2rem)" }}
      >
        Profil Saya
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 350px), 1fr))",
          gap: "20px",
          marginTop: "20px",
          maxWidth: "1400px",
          width: "100%",
        }}
      >
        {/* Left Column - Profile Picture & Account Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Profile Picture Card */}
          <div className="dashboard-card">
            <h3>Foto Profil</h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              {profilePicturePreview ? (
                <img
                  src={profilePicturePreview}
                  alt="Profile"
                  style={{
                    width: "min(180px, 50vw)",
                    height: "min(180px, 50vw)",
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: "4px solid var(--accent-color)",
                    marginBottom: "20px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                style={{
                  width: "min(180px, 50vw)",
                  height: "min(180px, 50vw)",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "50%",
                  border: "4px solid var(--accent-color)",
                  display: profilePicturePreview ? "none" : "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "clamp(3em, 10vw, 5em)",
                  color: "#fff",
                  marginBottom: "20px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                }}
              >
                👤
              </div>

              {editing && (
                <div style={{ width: "100%", textAlign: "center" }}>
                  <label
                    style={{
                      display: "inline-block",
                      padding: "10px 20px",
                      background: "var(--accent-color)",
                      color: "white",
                      borderRadius: "5px",
                      cursor: "pointer",
                      marginBottom: "10px",
                      fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
                    }}
                  >
                    Pilih Foto
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </label>
                  <small
                    style={{
                      display: "block",
                      color: "var(--text-secondary)",
                      fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
                    }}
                  >
                    Maksimal 2MB. Format: JPG, PNG
                  </small>
                </div>
              )}
            </div>
          </div>

          {/* Informasi Akun */}
          <div className="dashboard-card">
            <h3
              style={{
                marginBottom: "20px",
                borderBottom: "2px solid var(--accent-color)",
                paddingBottom: "10px",
                fontSize: "clamp(1.1rem, 3vw, 1.3rem)",
              }}
            >
              Informasi Akun
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  padding: "8px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <span style={{ color: "var(--text-secondary)" }}>
                  Username:
                </span>
                <strong style={{ wordBreak: "break-word" }}>
                  {user?.username}
                </strong>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  padding: "8px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <span style={{ color: "var(--text-secondary)" }}>Email:</span>
                <strong style={{ wordBreak: "break-all" }}>
                  {user?.email}
                </strong>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  padding: "8px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <span style={{ color: "var(--text-secondary)" }}>NIK:</span>
                <strong>{user?.profile?.nik}</strong>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "8px",
                  padding: "8px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <span style={{ color: "var(--text-secondary)" }}>
                  Status Akun:
                </span>
                <span
                  style={{
                    color: user?.isActive
                      ? "var(--success-color)"
                      : "var(--error-color)",
                    fontWeight: "bold",
                    padding: "4px 12px",
                    borderRadius: "12px",
                    background: user?.isActive
                      ? "rgba(46, 213, 115, 0.1)"
                      : "rgba(255, 71, 87, 0.1)",
                    fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
                  }}
                >
                  {user?.isActive ? "✓ Aktif" : "✗ Tidak Aktif"}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "8px",
                  padding: "8px 0",
                }}
              >
                <span style={{ color: "var(--text-secondary)" }}>
                  Terverifikasi:
                </span>
                <span
                  style={{
                    color: user?.isVerified
                      ? "var(--success-color)"
                      : "var(--warning-color)",
                    fontWeight: "bold",
                    padding: "4px 12px",
                    borderRadius: "12px",
                    background: user?.isVerified
                      ? "rgba(46, 213, 115, 0.1)"
                      : "rgba(255, 184, 0, 0.1)",
                    fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
                  }}
                >
                  {user?.isVerified ? "✓ Terverifikasi" : "⚠ Belum"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Personal Data & Security */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Data Pribadi */}
          <div className="dashboard-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "20px",
                borderBottom: "2px solid var(--accent-color)",
                paddingBottom: "10px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "clamp(1.1rem, 3vw, 1.3rem)" }}>
                Data Pribadi
              </h3>
              {!editing && (
                <button
                  className="edit-btn"
                  onClick={() => setEditing(true)}
                  style={{
                    padding: "8px 20px",
                    fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)",
                    whiteSpace: "nowrap",
                  }}
                >
                  ✏️ Edit
                </button>
              )}
            </div>

            {editing ? (
              <form
                onSubmit={handleUpdateProfile}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                <div className="form-group">
                  <label
                    style={{
                      fontWeight: "600",
                      marginBottom: "5px",
                      display: "block",
                      fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)",
                    }}
                  >
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ddd",
                      fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div className="form-group">
                  <label
                    style={{
                      fontWeight: "600",
                      marginBottom: "5px",
                      display: "block",
                      fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)",
                    }}
                  >
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ddd",
                      fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(min(100%, 150px), 1fr))",
                    gap: "15px",
                  }}
                >
                  <div className="form-group">
                    <label
                      style={{
                        fontWeight: "600",
                        marginBottom: "5px",
                        display: "block",
                        fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)",
                      }}
                    >
                      Tanggal Lahir
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #ddd",
                        fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label
                      style={{
                        fontWeight: "600",
                        marginBottom: "5px",
                        display: "block",
                        fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)",
                      }}
                    >
                      Jenis Kelamin
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #ddd",
                        fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
                        boxSizing: "border-box",
                      }}
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label
                    style={{
                      fontWeight: "600",
                      marginBottom: "5px",
                      display: "block",
                      fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)",
                    }}
                  >
                    Alamat Lengkap
                  </label>
                  <textarea
                    name="address.fullAddress"
                    value={formData.address.fullAddress}
                    onChange={handleChange}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ddd",
                      resize: "vertical",
                      fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >
                  <button
                    type="submit"
                    className="submit-btn"
                    style={{
                      width: "100%",
                      fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
                    }}
                  >
                    💾 Simpan Perubahan
                  </button>
                  <button
                    type="button"
                    className="reset-btn"
                    onClick={() => {
                      setEditing(false);
                      setProfilePicture(null);
                      fetchUserData();
                    }}
                    style={{
                      width: "100%",
                      fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
                    }}
                  >
                    ✖ Batal
                  </button>
                </div>
              </form>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    padding: "10px",
                    background: "#f8f9fa",
                    borderRadius: "5px",
                  }}
                >
                  <span
                    style={{
                      color: "var(--text-secondary)",
                      fontWeight: "500",
                    }}
                  >
                    Nama:
                  </span>
                  <strong style={{ wordBreak: "break-word" }}>
                    {user?.profile?.fullName}
                  </strong>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    padding: "10px",
                    background: "#f8f9fa",
                    borderRadius: "5px",
                  }}
                >
                  <span
                    style={{
                      color: "var(--text-secondary)",
                      fontWeight: "500",
                    }}
                  >
                    Telepon:
                  </span>
                  <strong style={{ wordBreak: "break-word" }}>
                    {user?.profile?.phone}
                  </strong>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    padding: "10px",
                    background: "#f8f9fa",
                    borderRadius: "5px",
                  }}
                >
                  <span
                    style={{
                      color: "var(--text-secondary)",
                      fontWeight: "500",
                    }}
                  >
                    Tanggal Lahir:
                  </span>
                  <strong>
                    {new Date(user?.profile?.dateOfBirth).toLocaleDateString(
                      "id-ID"
                    )}
                  </strong>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    padding: "10px",
                    background: "#f8f9fa",
                    borderRadius: "5px",
                  }}
                >
                  <span
                    style={{
                      color: "var(--text-secondary)",
                      fontWeight: "500",
                    }}
                  >
                    Jenis Kelamin:
                  </span>
                  <strong>{user?.profile?.gender}</strong>
                </div>
                <div
                  style={{
                    padding: "10px",
                    background: "#f8f9fa",
                    borderRadius: "5px",
                  }}
                >
                  <span
                    style={{
                      color: "var(--text-secondary)",
                      fontWeight: "500",
                      display: "block",
                      marginBottom: "5px",
                    }}
                  >
                    Alamat:
                  </span>
                  <strong style={{ wordBreak: "break-word" }}>
                    {user?.profile?.address?.fullAddress || "-"}
                  </strong>
                </div>
              </div>
            )}
          </div>

          {/* Keamanan */}
          <div className="dashboard-card">
            <h3
              style={{
                marginBottom: "20px",
                borderBottom: "2px solid var(--accent-color)",
                paddingBottom: "10px",
                fontSize: "clamp(1.1rem, 3vw, 1.3rem)",
              }}
            >
              🔒 Keamanan
            </h3>

            {!showPasswordForm ? (
              <div>
                <p
                  style={{
                    marginBottom: "20px",
                    fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)",
                    color: "var(--text-secondary)",
                    lineHeight: "1.6",
                  }}
                >
                  Ubah password Anda secara berkala untuk menjaga keamanan akun
                </p>
                <button
                  className="submit-btn"
                  onClick={() => setShowPasswordForm(true)}
                  style={{
                    width: "100%",
                    fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
                  }}
                >
                  🔑 Ubah Password
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleChangePassword}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                <div className="form-group">
                  <label
                    style={{
                      fontWeight: "600",
                      marginBottom: "5px",
                      display: "block",
                      fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)",
                    }}
                  >
                    Password Lama
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ddd",
                      fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div className="form-group">
                  <label
                    style={{
                      fontWeight: "600",
                      marginBottom: "5px",
                      display: "block",
                      fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)",
                    }}
                  >
                    Password Baru
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    minLength={6}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ddd",
                      fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div className="form-group">
                  <label
                    style={{
                      fontWeight: "600",
                      marginBottom: "5px",
                      display: "block",
                      fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)",
                    }}
                  >
                    Konfirmasi Password Baru
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    minLength={6}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ddd",
                      fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >
                  <button
                    type="submit"
                    className="submit-btn"
                    style={{
                      width: "100%",
                      fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
                    }}
                  >
                    💾 Ubah Password
                  </button>
                  <button
                    type="button"
                    className="reset-btn"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                    style={{
                      width: "100%",
                      fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
                    }}
                  >
                    ✖ Batal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

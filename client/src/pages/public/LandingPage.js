// File: client/src/pages/public/LandingPage.js

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "Poppins, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          background: "rgba(44, 62, 80, 0.95)",
          backdropFilter: "blur(10px)",
          padding: "15px 0",
          zIndex: 1000,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "#1ABC9C",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                color: "white",
                fontSize: "clamp(1em, 3vw, 1.2em)",
              }}
            >
              P
            </div>
            <span
              style={{
                color: "white",
                fontWeight: "600",
                fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)",
                whiteSpace: "nowrap",
              }}
            >
              PMI Rembang
            </span>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              color: "white",
              fontSize: "1.5em",
              cursor: "pointer",
              padding: "5px",
            }}
            className="mobile-menu-toggle"
          >
            ☰
          </button>

          {/* Desktop Menu */}
          <div
            className="desktop-menu"
            style={{
              display: "flex",
              gap: "clamp(15px, 3vw, 30px)",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => scrollToSection("home")}
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "clamp(0.85rem, 2vw, 1rem)",
                padding: "5px 10px",
                transition: "color 0.3s",
                whiteSpace: "nowrap",
              }}
            >
              Beranda
            </button>
            <button
              onClick={() => scrollToSection("features")}
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "clamp(0.85rem, 2vw, 1rem)",
                padding: "5px 10px",
                whiteSpace: "nowrap",
              }}
            >
              Fitur
            </button>
            <button
              onClick={() => scrollToSection("about")}
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "clamp(0.85rem, 2vw, 1rem)",
                padding: "5px 10px",
                whiteSpace: "nowrap",
              }}
            >
              Tentang
            </button>
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "#1ABC9C",
                border: "none",
                color: "white",
                padding: "clamp(6px, 1.5vw, 8px) clamp(15px, 3vw, 20px)",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "clamp(0.85rem, 2vw, 1rem)",
                transition: "background 0.3s",
                whiteSpace: "nowrap",
              }}
            >
              Login
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div
              className="mobile-menu"
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "rgba(44, 62, 80, 0.95)",
                backdropFilter: "blur(10px)",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                zIndex: 1000,
              }}
            >
              <button
                onClick={() => {
                  scrollToSection("home");
                  setMobileMenuOpen(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "1rem",
                  padding: "10px",
                  textAlign: "left",
                  borderRadius: "5px",
                  transition: "background 0.3s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.background = "rgba(255,255,255,0.1)")
                }
                onMouseOut={(e) => (e.target.style.background = "none")}
              >
                Beranda
              </button>
              <button
                onClick={() => {
                  scrollToSection("features");
                  setMobileMenuOpen(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "1rem",
                  padding: "10px",
                  textAlign: "left",
                  borderRadius: "5px",
                  transition: "background 0.3s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.background = "rgba(255,255,255,0.1)")
                }
                onMouseOut={(e) => (e.target.style.background = "none")}
              >
                Fitur
              </button>
              <button
                onClick={() => {
                  scrollToSection("about");
                  setMobileMenuOpen(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "1rem",
                  padding: "10px",
                  textAlign: "left",
                  borderRadius: "5px",
                  transition: "background 0.3s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.background = "rgba(255,255,255,0.1)")
                }
                onMouseOut={(e) => (e.target.style.background = "none")}
              >
                Tentang
              </button>
              <button
                onClick={() => {
                  navigate("/login");
                  setMobileMenuOpen(false);
                }}
                style={{
                  background: "#1ABC9C",
                  border: "none",
                  color: "white",
                  padding: "12px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "1rem",
                  transition: "background 0.3s",
                  marginTop: "10px",
                }}
                onMouseOver={(e) => (e.target.style.background = "#16a085")}
                onMouseOut={(e) => (e.target.style.background = "#1ABC9C")}
              >
                Login
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        style={{
          minHeight: "100vh",
          width: "100vw",
          background: "linear-gradient(135deg, #2C3E50 0%, #3498DB 100%)",
          display: "flex",
          alignItems: "center",
          padding:
            "clamp(80px, 15vh, 100px) clamp(15px, 4vw, 20px) clamp(40px, 8vh, 60px)",
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            width: "clamp(150px, 30vw, 300px)",
            height: "clamp(150px, 30vw, 300px)",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.05)",
            top: "-100px",
            right: "-100px",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "clamp(100px, 20vw, 200px)",
            height: "clamp(100px, 20vw, 200px)",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.05)",
            bottom: "50px",
            left: "-50px",
          }}
        />

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            width: "100%",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: "clamp(30px, 8vw, 50px)",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ color: "white" }}>
            <div
              style={{
                display: "inline-block",
                padding: "clamp(6px, 1.5vw, 8px) clamp(15px, 3vw, 20px)",
                background: "rgba(26, 188, 156, 0.2)",
                borderRadius: "20px",
                marginBottom: "clamp(15px, 3vw, 20px)",
                border: "1px solid rgba(26, 188, 156, 0.5)",
              }}
            >
              <span
                style={{
                  fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                  fontWeight: "500",
                }}
              >
                🚀 Sistem Digital Terpadu
              </span>
            </div>

            <h1
              style={{
                fontSize: "clamp(1.8rem, 6vw, 3rem)",
                marginBottom: "clamp(15px, 3vw, 20px)",
                fontWeight: "700",
                lineHeight: "1.2",
              }}
            >
              Sistem Pendaftaran & Rekap Data
              <br />
              <span style={{ color: "#1ABC9C" }}>PMI Kabupaten Rembang</span>
            </h1>

            <p
              style={{
                fontSize: "clamp(0.95rem, 2.5vw, 1.2rem)",
                marginBottom: "clamp(25px, 5vw, 40px)",
                lineHeight: "1.8",
                opacity: 0.9,
              }}
            >
              Platform digital modern untuk pendataan, monitoring, dan
              pengelolaan Pekerja Migran Indonesia secara efektif dan
              transparan.
            </p>

            <div
              style={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
              }}
            >
              <Link
                to="/register"
                style={{
                  display: "inline-block",
                  padding: "clamp(12px, 2.5vw, 15px) clamp(25px, 5vw, 35px)",
                  background: "#1ABC9C",
                  color: "white",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)",
                  boxShadow: "0 4px 15px rgba(26, 188, 156, 0.3)",
                  transition: "all 0.3s",
                  border: "none",
                  whiteSpace: "nowrap",
                }}
                onMouseOver={(e) =>
                  (e.target.style.transform = "translateY(-2px)")
                }
                onMouseOut={(e) => (e.target.style.transform = "translateY(0)")}
              >
                Daftar Sekarang
              </Link>

              <Link
                to="/login"
                style={{
                  display: "inline-block",
                  padding: "clamp(12px, 2.5vw, 15px) clamp(25px, 5vw, 35px)",
                  background: "transparent",
                  color: "white",
                  border: "2px solid white",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)",
                  transition: "all 0.3s",
                  whiteSpace: "nowrap",
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "white";
                  e.target.style.color = "#2C3E50";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "white";
                }}
              >
                Login
              </Link>
            </div>

            <div
              style={{
                marginTop: "clamp(25px, 5vw, 40px)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                gap: "clamp(20px, 4vw, 30px)",
                maxWidth: "500px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "clamp(1.5rem, 4vw, 2rem)",
                    fontWeight: "bold",
                    color: "#1ABC9C",
                  }}
                >
                  1000+
                </div>
                <div
                  style={{
                    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                    opacity: 0.8,
                  }}
                >
                  PMI Terdaftar
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "clamp(1.5rem, 4vw, 2rem)",
                    fontWeight: "bold",
                    color: "#1ABC9C",
                  }}
                >
                  14
                </div>
                <div
                  style={{
                    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                    opacity: 0.8,
                  }}
                >
                  Kecamatan
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "clamp(1.5rem, 4vw, 2rem)",
                    fontWeight: "bold",
                    color: "#1ABC9C",
                  }}
                >
                  24/7
                </div>
                <div
                  style={{
                    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                    opacity: 0.8,
                  }}
                >
                  Online Support
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px 0",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "500px",
                height: "clamp(250px, 50vw, 400px)",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "20px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "clamp(4em, 15vw, 8em)",
                color: "rgba(255,255,255,0.3)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              }}
            >
              🌍
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        style={{
          background: "white",
          padding: "clamp(50px, 10vw, 80px) clamp(15px, 4vw, 20px)",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              textAlign: "center",
              marginBottom: "clamp(40px, 8vw, 60px)",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "clamp(6px, 1.5vw, 8px) clamp(15px, 3vw, 20px)",
                background: "rgba(52, 152, 219, 0.1)",
                borderRadius: "20px",
                marginBottom: "15px",
                color: "#3498DB",
                fontWeight: "600",
                fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
              }}
            >
              FITUR UNGGULAN
            </div>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
                marginBottom: "15px",
                color: "#2C3E50",
                fontWeight: "700",
              }}
            >
              Kemudahan untuk Semua
            </h2>
            <p
              style={{
                fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)",
                color: "#7F8C8D",
                maxWidth: "600px",
                margin: "0 auto",
                lineHeight: "1.6",
                padding: "0 15px",
              }}
            >
              Platform yang dirancang untuk memudahkan proses pendaftaran hingga
              keberangkatan PMI
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              gap: "clamp(20px, 4vw, 30px)",
            }}
          >
            {[
              {
                icon: "📋",
                title: "Pendaftaran Online",
                desc: "Daftar sebagai calon PMI kapan saja, dimana saja dengan proses yang cepat dan mudah",
              },
              {
                icon: "📊",
                title: "Tracking Real-time",
                desc: "Pantau status aplikasi Anda dari tahap pendaftaran hingga keberangkatan",
              },
              {
                icon: "📁",
                title: "Manajemen Dokumen",
                desc: "Upload dan kelola semua dokumen pendukung dalam satu platform aman",
              },
              {
                icon: "💼",
                title: "Database Terpadu",
                desc: "Sistem database yang terintegrasi untuk kemudahan pengelolaan data PMI",
              },
              {
                icon: "📈",
                title: "Laporan & Statistik",
                desc: "Akses data statistik dan laporan komprehensif untuk analisis yang lebih baik",
              },
              {
                icon: "🔐",
                title: "Keamanan Terjamin",
                desc: "Data pribadi Anda dilindungi dengan enkripsi dan sistem keamanan berlapis",
              },
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  padding: "clamp(25px, 5vw, 35px)",
                  background: "#f8f9fa",
                  borderRadius: "15px",
                  textAlign: "center",
                  transition: "all 0.3s",
                  cursor: "pointer",
                  border: "2px solid transparent",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 30px rgba(0,0,0,0.1)";
                  e.currentTarget.style.borderColor = "#1ABC9C";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "transparent";
                }}
              >
                <div
                  style={{
                    fontSize: "clamp(2.5em, 8vw, 3.5em)",
                    marginBottom: "clamp(15px, 3vw, 20px)",
                  }}
                >
                  {feature.icon}
                </div>
                <h4
                  style={{
                    fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
                    marginBottom: "15px",
                    color: "#2C3E50",
                    fontWeight: "600",
                  }}
                >
                  {feature.title}
                </h4>
                <p
                  style={{
                    color: "#7F8C8D",
                    lineHeight: "1.6",
                    fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                  }}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About/Process Section */}
      <section
        id="about"
        style={{
          background: "linear-gradient(135deg, #ECF0F1 0%, #BDC3C7 100%)",
          padding: "clamp(50px, 10vw, 80px) clamp(15px, 4vw, 20px)",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              textAlign: "center",
              marginBottom: "clamp(40px, 8vw, 60px)",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
                marginBottom: "15px",
                color: "#2C3E50",
                fontWeight: "700",
              }}
            >
              Proses Pendaftaran Mudah
            </h2>
            <p
              style={{
                fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)",
                color: "#555",
                maxWidth: "600px",
                margin: "0 auto",
                lineHeight: "1.6",
                padding: "0 15px",
              }}
            >
              Hanya 4 langkah sederhana untuk memulai perjalanan Anda sebagai
              PMI
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
              gap: "clamp(30px, 6vw, 40px)",
            }}
          >
            {[
              {
                step: "01",
                title: "Registrasi Akun",
                desc: "Buat akun dengan mengisi data diri dan informasi kontak Anda",
              },
              {
                step: "02",
                title: "Lengkapi Aplikasi",
                desc: "Isi formulir aplikasi dan upload dokumen yang diperlukan",
              },
              {
                step: "03",
                title: "Verifikasi Admin",
                desc: "Tim kami akan memverifikasi data dan dokumen Anda",
              },
              {
                step: "04",
                title: "Siap Berangkat",
                desc: "Setelah disetujui, Anda siap untuk proses keberangkatan",
              },
            ].map((step, index) => (
              <div
                key={index}
                style={{
                  background: "white",
                  padding: "clamp(25px, 5vw, 30px)",
                  borderRadius: "15px",
                  textAlign: "center",
                  position: "relative",
                  boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
                  marginTop: "30px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "clamp(50px, 10vw, 60px)",
                    height: "clamp(50px, 10vw, 60px)",
                    background: "#1ABC9C",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "clamp(1.2em, 3vw, 1.5em)",
                    fontWeight: "bold",
                    color: "white",
                    boxShadow: "0 5px 15px rgba(26, 188, 156, 0.3)",
                  }}
                >
                  {step.step}
                </div>
                <h4
                  style={{
                    fontSize: "clamp(1.1rem, 3vw, 1.3rem)",
                    marginTop: "clamp(20px, 4vw, 30px)",
                    marginBottom: "15px",
                    color: "#2C3E50",
                    fontWeight: "600",
                  }}
                >
                  {step.title}
                </h4>
                <p
                  style={{
                    color: "#7F8C8D",
                    lineHeight: "1.6",
                    fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
                  }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #2C3E50 0%, #3498DB 100%)",
          padding: "clamp(50px, 10vw, 80px) clamp(15px, 4vw, 20px)",
          textAlign: "center",
          color: "white",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
              marginBottom: "20px",
              fontWeight: "700",
            }}
          >
            Siap Memulai Perjalanan Anda?
          </h2>
          <p
            style={{
              fontSize: "clamp(0.95rem, 2.5vw, 1.2rem)",
              marginBottom: "clamp(30px, 6vw, 40px)",
              opacity: 0.9,
              lineHeight: "1.8",
              padding: "0 15px",
            }}
          >
            Bergabunglah dengan ribuan PMI lainnya yang telah mempercayai sistem
            kami untuk mengelola proses keberangkatan mereka.
          </p>
          <div
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/register"
              style={{
                display: "inline-block",
                padding: "clamp(14px, 3vw, 18px) clamp(30px, 6vw, 45px)",
                background: "#1ABC9C",
                color: "white",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                boxShadow: "0 5px 20px rgba(26, 188, 156, 0.4)",
                transition: "all 0.3s",
                whiteSpace: "nowrap",
              }}
            >
              Daftar Gratis Sekarang
            </Link>
            <Link
              to="/login"
              style={{
                display: "inline-block",
                padding: "clamp(14px, 3vw, 18px) clamp(30px, 6vw, 45px)",
                background: "white",
                color: "#2C3E50",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                transition: "all 0.3s",
                whiteSpace: "nowrap",
              }}
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: "#2C3E50",
          color: "white",
          padding:
            "clamp(40px, 8vw, 50px) clamp(15px, 4vw, 20px) clamp(25px, 5vw, 30px)",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
              gap: "clamp(30px, 6vw, 40px)",
              marginBottom: "clamp(30px, 6vw, 40px)",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "15px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "#1ABC9C",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    flexShrink: 0,
                  }}
                >
                  P
                </div>
                <span
                  style={{
                    fontWeight: "600",
                    fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                  }}
                >
                  PMI Rembang
                </span>
              </div>
              <p
                style={{
                  opacity: 0.8,
                  lineHeight: "1.6",
                  fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
                }}
              >
                Sistem Pendaftaran & Rekap Data PMI Kabupaten Rembang - Platform
                digital terpadu untuk pengelolaan data Pekerja Migran Indonesia.
              </p>
            </div>

            <div>
              <h4
                style={{
                  marginBottom: "15px",
                  fontWeight: "600",
                  fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
                }}
              >
                Navigasi
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {["home", "features", "about"].map((section, idx) => (
                  <li key={idx} style={{ marginBottom: "10px" }}>
                    <button
                      onClick={() => scrollToSection(section)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                        opacity: 0.8,
                        transition: "opacity 0.3s",
                        fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
                        textAlign: "left",
                        padding: 0,
                      }}
                    >
                      {section === "home"
                        ? "Beranda"
                        : section === "features"
                        ? "Fitur"
                        : "Tentang"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4
                style={{
                  marginBottom: "15px",
                  fontWeight: "600",
                  fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
                }}
              >
                Akses Cepat
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li style={{ marginBottom: "10px" }}>
                  <Link
                    to="/login"
                    style={{
                      color: "white",
                      textDecoration: "none",
                      opacity: 0.8,
                      transition: "opacity 0.3s",
                      fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
                    }}
                  >
                    Login
                  </Link>
                </li>
                <li style={{ marginBottom: "10px" }}>
                  <Link
                    to="/register"
                    style={{
                      color: "white",
                      textDecoration: "none",
                      opacity: 0.8,
                      transition: "opacity 0.3s",
                      fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
                    }}
                  >
                    Registrasi
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4
                style={{
                  marginBottom: "15px",
                  fontWeight: "600",
                  fontSize: "clamp(1rem, 2.5vw, 1.1rem)",
                }}
              >
                Kontak
              </h4>
              <div
                style={{
                  opacity: 0.8,
                  lineHeight: "1.8",
                  fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
                }}
              >
                <p style={{ margin: "0 0 10px 0", wordBreak: "break-word" }}>
                  📍 Kabupaten Rembang, Jawa Tengah
                </p>
                <p style={{ margin: "0 0 10px 0", wordBreak: "break-word" }}>
                  📧 info@pmirembang.go.id
                </p>
                <p style={{ margin: "0 0 10px 0" }}>📞 (0295) 123456</p>
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.1)",
              paddingTop: "clamp(20px, 4vw, 30px)",
              textAlign: "center",
              opacity: 0.8,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
              }}
            >
              © 2024 PMI Kabupaten Rembang. All rights reserved.
            </p>
            <p
              style={{
                margin: "10px 0 0 0",
                fontSize: "clamp(0.8rem, 1.8vw, 0.9rem)",
              }}
            >
              Dibuat dengan ❤️ untuk melayani Pekerja Migran Indonesia
            </p>
          </div>
        </div>
      </footer>

      {/* CSS for responsive design */}
      <style>
        {`
          /* Prevent horizontal overflow */
          body, html {
            overflow-x: hidden;
          }

          @media (max-width: 768px) {
            .mobile-menu-toggle {
              display: block !important;
            }
            .desktop-menu {
              display: none !important;
            }

            /* Hero grid stack */
            #home > div > div {
              grid-template-columns: 1fr !important;
            }

            /* Decorative circles hide on mobile */
            #home > div + div,
            #home > div + div + div {
              display: visible !important;
            }
          }

          @media (max-width: 576px) {
            /* Navbar adjustments */
            nav > div {
              padding: 0 10px !important;
            }

            /* Hero section adjustments */
            #home {
              padding: 120px 10px 40px !important;
              min-height: auto !important;
            }

            #home > div {
              gap: 30px !important;
            }

            #home h1 {
              font-size: 1.5rem !important;
              margin-bottom: 15px !important;
            }

            #home p {
              font-size: 0.9rem !important;
              margin-bottom: 20px !important;
            }

            /* Buttons in hero */
            #home a {
              padding: 12px 20px !important;
              font-size: 0.9rem !important;
              margin-bottom: 10px !important;
            }

            /* Stats grid */
            #home > div > div:first-child > div:last-child {
              grid-template-columns: repeat(3, 1fr) !important;
              gap: 15px !important;
              max-width: 100% !important;
            }

            /* Features section */
            #features {
              padding: 40px 10px !important;
            }

            #features h2 {
              font-size: 1.8rem !important;
            }

            #features > div > div:first-child > p {
              font-size: 0.95rem !important;
              padding: 0 !important;
            }

            /* Features grid */
            #features > div > div:last-child {
              grid-template-columns: 1fr !important;
              gap: 20px !important;
            }

            /* Feature cards */
            #features > div > div:last-child > div {
              padding: 20px !important;
            }

            #features > div > div:last-child > div > div:first-child {
              font-size: 2.5rem !important;
            }

            #features > div > div:last-child > div h4 {
              font-size: 1.1rem !important;
            }

            #features > div > div:last-child > div p {
              font-size: 0.9rem !important;
            }

            /* About section */
            #about {
              padding: 40px 10px !important;
            }

            #about h2 {
              font-size: 1.8rem !important;
            }

            #about > div > div:first-child > p {
              font-size: 0.95rem !important;
              padding: 0 !important;
            }

            /* Process steps grid */
            #about > div > div:last-child {
              grid-template-columns: 1fr !important;
              gap: 25px !important;
            }

            /* Process steps */
            #about > div > div:last-child > div {
              padding: 20px !important;
              margin-top: 20px !important;
            }

            #about > div > div:last-child > div h4 {
              font-size: 1rem !important;
            }

            #about > div > div:last-child > div p {
              font-size: 0.9rem !important;
            }

            /* CTA section */
            #home + section + section + section {
              padding: 40px 10px !important;
            }

            #home + section + section + section h2 {
              font-size: 1.8rem !important;
            }

            #home + section + section + section p {
              font-size: 0.95rem !important;
              padding: 0 !important;
            }

            /* CTA buttons */
            #home + section + section + section a {
              padding: 12px 25px !important;
              font-size: 0.9rem !important;
              margin-bottom: 10px !important;
            }

            /* Footer */
            footer {
              padding: 30px 10px 20px !important;
            }

            footer > div > div:first-child {
              grid-template-columns: 1fr !important;
              gap: 25px !important;
              margin-bottom: 25px !important;
            }

            footer h4 {
              font-size: 1rem !important;
            }

            footer p, footer li {
              font-size: 0.85rem !important;
              line-height: 1.5 !important;
            }

            footer > div > div:first-child > div:first-child p {
              font-size: 0.8rem !important;
            }
          }

          @media (max-width: 480px) {
            /* Further reductions for very small screens */
            #home {
              padding: 130px 10px 30px !important;
            }

            #home h1 {
              font-size: 1.3rem !important;
            }

            #home p {
              font-size: 0.85rem !important;
            }

            #features h2, #about h2, #home + section + section + section h2 {
              font-size: 1.5rem !important;
            }

            /* Stats grid three columns */
            #home > div > div:first-child > div:last-child {
              grid-template-columns: repeat(3, 1fr) !important;
              gap: 20px !important;
            }

            /* Feature cards smaller */
            #features > div > div:last-child > div {
              padding: 15px !important;
            }

            #features > div > div:last-child > div > div:first-child {
              font-size: 2rem !important;
            }

            #features > div > div:last-child > div h4 {
              font-size: 1rem !important;
            }

            /* Process steps smaller */
            #about > div > div:last-child > div {
              padding: 15px !important;
              margin-top: 15px !important;
            }

            #about > div > div:last-child > div h4 {
              font-size: 0.95rem !important;
            }

            /* Footer tighter */
            footer {
              padding: 25px 10px 15px !important;
            }

            footer > div > div:first-child {
              gap: 20px !important;
              margin-bottom: 20px !important;
            }

            footer h4 {
              font-size: 0.95rem !important;
            }

            footer p, footer li {
              font-size: 0.8rem !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default LandingPage;

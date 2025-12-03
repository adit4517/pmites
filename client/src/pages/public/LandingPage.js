// File: client/src/pages/public/LandingPage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Poppins, sans-serif'}}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(44, 62, 80, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '15px 0',
        zIndex: 1000,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#1ABC9C',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: 'white',
              fontSize: '1.2em'
            }}>P</div>
            <span style={{ color: 'white', fontWeight: '600', fontSize: '1.1em' }}>
              PMI Rembang
            </span>
          </div>

          {/* Desktop Menu */}
          <div style={{ 
            display: 'flex', 
            gap: '30px',
            '@media (maxWidth: 768px)': { display: 'none' }
          }}>
            <button 
              onClick={() => scrollToSection('home')}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1em',
                padding: '5px 10px',
                transition: 'color 0.3s'
              }}
            >
              Beranda
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1em',
                padding: '5px 10px'
              }}
            >
              Fitur
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1em',
                padding: '5px 10px'
              }}
            >
              Tentang
            </button>
            <button 
              onClick={() => navigate('/login')}
              style={{
                background: '#1ABC9C',
                border: 'none',
                color: 'white',
                padding: '8px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1em',
                transition: 'background 0.3s'
              }}
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" style={{
        minHeight: '100vh',
        width: '100vw', 
        background: 'linear-gradient(135deg, #2C3E50 0%, #3498DB 100%)',
        display: 'flex',
        alignItems: 'center',
        padding: '100px 20px 60px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255, 0, 0, 0)',
          top: '-100px',
          right: '-100px'
        }} />
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          bottom: '50px',
          left: '-50px'
        }} />

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '50px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ color: 'white' }}>
            <div style={{
              display: 'inline-block',
              padding: '8px 20px',
              background: 'rgba(26, 188, 156, 0.2)',
              borderRadius: '20px',
              marginBottom: '20px',
              border: '1px solid rgba(26, 188, 156, 0.5)'
            }}>
              <span style={{ fontSize: '0.9em', fontWeight: '500' }}>🚀 Sistem Digital Terpadu</span>
            </div>

            <h1 style={{ 
              fontSize: '3em', 
              marginBottom: '20px',
              fontWeight: '700',
              lineHeight: '1.2'
            }}>
              Sistem Pendaftaran & Rekap Data<br/>
              <span style={{ color: '#1ABC9C' }}>PMI Kabupaten Rembang</span>
            </h1>
            
            <p style={{
              fontSize: '1.2em',
              marginBottom: '40px',
              lineHeight: '1.8',
              opacity: 0.9
            }}>
              Platform digital modern untuk pendataan, monitoring, dan pengelolaan 
              Pekerja Migran Indonesia secara efektif dan transparan.
            </p>

            <div style={{
              display: 'flex',
              gap: '15px',
              flexWrap: 'wrap'
            }}>
              <Link 
                to="/register" 
                style={{
                  display: 'inline-block',
                  padding: '15px 35px',
                  background: '#1ABC9C',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '1.1em',
                  boxShadow: '0 4px 15px rgba(26, 188, 156, 0.3)',
                  transition: 'all 0.3s',
                  border: 'none'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Daftar Sekarang
              </Link>
              
              <Link 
                to="/login" 
                style={{
                  display: 'inline-block',
                  padding: '15px 35px',
                  background: 'transparent',
                  color: 'white',
                  border: '2px solid white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '1.1em',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.color = '#2C3E50';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'white';
                }}
              >
                Login
              </Link>
            </div>

            <div style={{ marginTop: '40px', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#1ABC9C' }}>1000+</div>
                <div style={{ fontSize: '0.9em', opacity: 0.8 }}>PMI Terdaftar</div>
              </div>
              <div>
                <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#1ABC9C' }}>14</div>
                <div style={{ fontSize: '0.9em', opacity: 0.8 }}>Kecamatan</div>
              </div>
              <div>
                <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#1ABC9C' }}>24/7</div>
                <div style={{ fontSize: '0.9em', opacity: 0.8 }}>Online Support</div>
              </div>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{
              width: '100%',
              maxWidth: '500px',
              height: '400px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8em',
              color: 'rgba(255,255,255,0.3)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
              🌍
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{
        background: 'white',
        padding: '80px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{
              display: 'inline-block',
              padding: '8px 20px',
              background: 'rgba(52, 152, 219, 0.1)',
              borderRadius: '20px',
              marginBottom: '15px',
              color: '#3498DB',
              fontWeight: '600'
            }}>
              FITUR UNGGULAN
            </div>
            <h2 style={{
              fontSize: '2.5em',
              marginBottom: '15px',
              color: '#2C3E50',
              fontWeight: '700'
            }}>
              Kemudahan untuk Semua
            </h2>
            <p style={{
              fontSize: '1.1em',
              color: '#7F8C8D',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Platform yang dirancang untuk memudahkan proses pendaftaran hingga keberangkatan PMI
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {[
              {
                icon: '📋',
                title: 'Pendaftaran Online',
                desc: 'Daftar sebagai calon PMI kapan saja, dimana saja dengan proses yang cepat dan mudah'
              },
              {
                icon: '📊',
                title: 'Tracking Real-time',
                desc: 'Pantau status aplikasi Anda dari tahap pendaftaran hingga keberangkatan'
              },
              {
                icon: '📁',
                title: 'Manajemen Dokumen',
                desc: 'Upload dan kelola semua dokumen pendukung dalam satu platform aman'
              },
              {
                icon: '💼',
                title: 'Database Terpadu',
                desc: 'Sistem database yang terintegrasi untuk kemudahan pengelolaan data PMI'
              },
              {
                icon: '📈',
                title: 'Laporan & Statistik',
                desc: 'Akses data statistik dan laporan komprehensif untuk analisis yang lebih baik'
              },
              {
                icon: '🔐',
                title: 'Keamanan Terjamin',
                desc: 'Data pribadi Anda dilindungi dengan enkripsi dan sistem keamanan berlapis'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                style={{
                  padding: '35px',
                  background: '#f8f9fa',
                  borderRadius: '15px',
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  border: '2px solid transparent'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = '#1ABC9C';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <div style={{
                  fontSize: '3.5em',
                  marginBottom: '20px'
                }}>{feature.icon}</div>
                <h4 style={{
                  fontSize: '1.4em',
                  marginBottom: '15px',
                  color: '#2C3E50',
                  fontWeight: '600'
                }}>
                  {feature.title}
                </h4>
                <p style={{ 
                  color: '#7F8C8D',
                  lineHeight: '1.6',
                  fontSize: '1em'
                }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About/Process Section */}
      <section id="about" style={{
        background: 'linear-gradient(135deg, #ECF0F1 0%, #BDC3C7 100%)',
        padding: '80px 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '2.5em',
              marginBottom: '15px',
              color: '#2C3E50',
              fontWeight: '700'
            }}>
              Proses Pendaftaran Mudah
            </h2>
            <p style={{
              fontSize: '1.1em',
              color: '#555',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Hanya 4 langkah sederhana untuk memulai perjalanan Anda sebagai PMI
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px'
          }}>
            {[
              {
                step: '01',
                title: 'Registrasi Akun',
                desc: 'Buat akun dengan mengisi data diri dan informasi kontak Anda'
              },
              {
                step: '02',
                title: 'Lengkapi Aplikasi',
                desc: 'Isi formulir aplikasi dan upload dokumen yang diperlukan'
              },
              {
                step: '03',
                title: 'Verifikasi Admin',
                desc: 'Tim kami akan memverifikasi data dan dokumen Anda'
              },
              {
                step: '04',
                title: 'Siap Berangkat',
                desc: 'Setelah disetujui, Anda siap untuk proses keberangkatan'
              }
            ].map((step, index) => (
              <div key={index} style={{
                background: 'white',
                padding: '30px',
                borderRadius: '15px',
                textAlign: 'center',
                position: 'relative',
                boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '60px',
                  background: '#1ABC9C',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5em',
                  fontWeight: 'bold',
                  color: 'white',
                  boxShadow: '0 5px 15px rgba(26, 188, 156, 0.3)'
                }}>
                  {step.step}
                </div>
                <h4 style={{
                  fontSize: '1.3em',
                  marginTop: '30px',
                  marginBottom: '15px',
                  color: '#2C3E50',
                  fontWeight: '600'
                }}>
                  {step.title}
                </h4>
                <p style={{ color: '#7F8C8D', lineHeight: '1.6' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: 'linear-gradient(135deg, #2C3E50 0%, #3498DB 100%)',
        padding: '80px 20px',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5em',
            marginBottom: '20px',
            fontWeight: '700'
          }}>
            Siap Memulai Perjalanan Anda?
          </h2>
          <p style={{
            fontSize: '1.2em',
            marginBottom: '40px',
            opacity: 0.9,
            lineHeight: '1.8'
          }}>
            Bergabunglah dengan ribuan PMI lainnya yang telah mempercayai sistem kami
            untuk mengelola proses keberangkatan mereka.
          </p>
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link 
              to="/register" 
              style={{
                display: 'inline-block',
                padding: '18px 45px',
                background: '#1ABC9C',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1.2em',
                boxShadow: '0 5px 20px rgba(26, 188, 156, 0.4)',
                transition: 'all 0.3s'
              }}
            >
              Daftar Gratis Sekarang
            </Link>
            <Link 
              to="/login" 
              style={{
                display: 'inline-block',
                padding: '18px 45px',
                background: 'white',
                color: '#2C3E50',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1.2em',
                transition: 'all 0.3s'
              }}
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#2C3E50',
        color: 'white',
        padding: '50px 20px 30px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px',
            marginBottom: '40px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#1ABC9C',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>P</div>
                <span style={{ fontWeight: '600', fontSize: '1.2em' }}>PMI Rembang</span>
              </div>
              <p style={{ opacity: 0.8, lineHeight: '1.6' }}>
                Sistem Pendaftaran & Rekap Data PMI Kabupaten Rembang - Platform digital terpadu untuk pengelolaan data Pekerja Migran Indonesia.
              </p>
            </div>

            <div>
              <h4 style={{ marginBottom: '15px', fontWeight: '600' }}>Navigasi</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '10px' }}>
                  <button 
                    onClick={() => scrollToSection('home')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      opacity: 0.8,
                      transition: 'opacity 0.3s'
                    }}
                  >
                    Beranda
                  </button>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <button 
                    onClick={() => scrollToSection('features')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      opacity: 0.8,
                      transition: 'opacity 0.3s'
                    }}
                  >
                    Fitur
                  </button>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <button 
                    onClick={() => scrollToSection('about')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      opacity: 0.8,
                      transition: 'opacity 0.3s'
                    }}
                  >
                    Tentang
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 style={{ marginBottom: '15px', fontWeight: '600' }}>Akses Cepat</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '10px' }}>
                  <Link 
                    to="/login"
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                      opacity: 0.8,
                      transition: 'opacity 0.3s'
                    }}
                  >
                    Login
                  </Link>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <Link 
                    to="/register"
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                      opacity: 0.8,
                      transition: 'opacity 0.3s'
                    }}
                  >
                    Registrasi
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 style={{ marginBottom: '15px', fontWeight: '600' }}>Kontak</h4>
              <div style={{ opacity: 0.8, lineHeight: '1.8' }}>
                <p style={{ margin: '0 0 10px 0' }}>📍 Kabupaten Rembang, Jawa Tengah</p>
                <p style={{ margin: '0 0 10px 0' }}>📧 info@pmirembang.go.id</p>
                <p style={{ margin: '0 0 10px 0' }}>📞 (0295) 123456</p>
              </div>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '30px',
            textAlign: 'center',
            opacity: 0.8
          }}>
            <p style={{ margin: 0 }}>
              © 2024 PMI Kabupaten Rembang. All rights reserved.
            </p>
            <p style={{ margin: '10px 0 0 0', fontSize: '0.9em' }}>
              Dibuat dengan ❤️ untuk melayani Pekerja Migran Indonesia
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
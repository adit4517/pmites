// File: client/src/components/common/Navbar.js

import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';

const Navbar = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMinimized, setIsMinimized] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin logout?')) {
      dispatch({ type: 'LOGOUT' });
      navigate('/login');
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    // Update main content margin
    const mainContent = document.querySelector('.main-content-with-navbar');
    if (mainContent) {
      mainContent.style.marginLeft = isMinimized ? '260px' : '80px';
    }
  };

  return (
    <nav className={`navbar ${isMinimized ? 'navbar-minimized' : ''}`} style={{
      width: isMinimized ? '80px' : '260px',
      transition: 'width 0.3s ease'
    }}>
      {/* Toggle Button */}
      <button 
        onClick={toggleMinimize}
        style={{
          position: 'absolute',
          top: '20px',
          right: '-15px',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          background: 'var(--accent-color)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          zIndex: 10
        }}
      >
        {isMinimized ? '→' : '←'}
      </button>

      <div className="navbar-header" style={{
        textAlign: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          background: 'var(--accent-color)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 15px',
          fontSize: '1.8em',
          fontWeight: 'bold',
          color: 'white',
          border: '2px solid rgba(255,255,255,0.3)'
        }}>
          P
        </div>
        {!isMinimized && (
          <h2 style={{
            fontSize: '1.1em',
            fontWeight: 600,
            margin: 0,
            lineHeight: 1.3
          }}>
            Sistem PMI<br/>Kab. Rembang
          </h2>
        )}
      </div>

      <ul className="navbar-links" style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        flexGrow: 1
      }}>
        <li>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => isActive ? "active" : ""}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 15px',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              marginBottom: '8px',
              transition: 'all 0.3s'
            }}
            title={isMinimized ? "Dashboard" : ""}
          >
            <span style={{ fontSize: '1.3em', minWidth: '24px' }}>📊</span>
            {!isMinimized && <span>Dashboard</span>}
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/submissions" 
            className={({ isActive }) => isActive ? "active" : ""}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 15px',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              marginBottom: '8px',
              transition: 'all 0.3s'
            }}
            title={isMinimized ? "Review Aplikasi" : ""}
          >
            <span style={{ fontSize: '1.3em', minWidth: '24px' }}>✓</span>
            {!isMinimized && <span>Review Aplikasi</span>}
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/data-pmi" 
            className={({ isActive }) => isActive ? "active" : ""}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 15px',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              marginBottom: '8px',
              transition: 'all 0.3s'
            }}
            title={isMinimized ? "Data PMI" : ""}
          >
            <span style={{ fontSize: '1.3em', minWidth: '24px' }}>📁</span>
            {!isMinimized && <span>Data PMI</span>}
          </NavLink>
        </li>
      </ul>

      <div className="navbar-logout" style={{ marginTop: 'auto' }}>
        <button 
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '12px 15px',
            backgroundColor: 'var(--error-color)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: 'var(--font-primary)',
            fontWeight: 500,
            fontSize: '1em',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            justifyContent: isMinimized ? 'center' : 'flex-start',
            transition: 'all 0.3s'
          }}
          title={isMinimized ? "Logout" : ""}
        >
          <span style={{ fontSize: '1.2em' }}>🚪</span>
          {!isMinimized && <span>Logout</span>}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
// File: client/src/components/layout/ResponsiveSidebar.js

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/ResponsiveLayout.css';

const ResponsiveSidebar = ({ user, onLogout }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowSidebar(false); // Reset sidebar state pada desktop
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setShowSidebar(!showSidebar);
    } else {
      setIsMinimized(!isMinimized);
    }
  };

  const closeSidebar = () => {
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  const isAdmin = user?.role === 'admin';

  const menuItems = isAdmin ? [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/calon-pmi', icon: '👥', label: 'Calon PMI' },
    { path: '/admin/data-pmi', icon: '📋', label: 'Data PMI' },
    { path: '/admin/users', icon: '👤', label: 'Kelola User' },
    { path: '/admin/profile', icon: '⚙️', label: 'Profil Saya' }
  ] : [
    { path: '/user/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/user/status', icon: '📝', label: 'Status Aplikasi' },
    { path: '/user/profile', icon: '👤', label: 'Profil Saya' }
  ];

  return (
    <>
      {/* Toggle Button - visible on all screens */}
      <button 
        className="sidebar-toggle" 
        onClick={toggleSidebar}
        style={{
          display: isMobile || !isMinimized ? 'block' : 'none'
        }}
      >
        {isMobile ? (showSidebar ? '✕' : '☰') : (isMinimized ? '☰' : '✕')}
      </button>

      {/* Overlay untuk mobile */}
      {isMobile && (
        <div 
          className={`sidebar-overlay ${showSidebar ? 'active' : ''}`}
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`sidebar ${isMobile ? (showSidebar ? '' : 'minimized') : (isMinimized ? 'minimized' : '')}`}
        style={{
          background: 'linear-gradient(180deg, #2c3e50 0%, #34495e 100%)',
          boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{
          padding: isMinimized && !isMobile ? '20px 10px' : '30px 20px',
          textAlign: 'center',
          borderBottom: '2px solid rgba(255,255,255,0.1)',
          background: 'rgba(0,0,0,0.2)'
        }}>
          <div style={{
            width: isMinimized && !isMobile ? '40px' : '80px',
            height: isMinimized && !isMobile ? '40px' : '80px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            margin: '0 auto 15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMinimized && !isMobile ? '1.5em' : '2.5em',
            color: 'white',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
          }}>
            {isMinimized && !isMobile ? 'P' : '🏢'}
          </div>
          {(!isMinimized || isMobile) && (
            <>
              <h2 style={{ 
                color: 'white', 
                margin: '0 0 5px 0',
                fontSize: '1.3em'
              }}>
                PMI Portal
              </h2>
              <p style={{ 
                color: 'rgba(255,255,255,0.7)', 
                margin: 0,
                fontSize: '0.9em'
              }}>
                Calon PMI
              </p>
            </>
          )}
        </div>

        {/* Navigation Menu */}
        <nav style={{
          flex: 1,
          padding: '20px 0',
          overflowY: 'auto'
        }}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className="nav-link"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: isMinimized && !isMobile ? '15px 10px' : '15px 25px',
                color: isActive(item.path) ? '#fff' : 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                background: isActive(item.path) 
                  ? 'linear-gradient(90deg, rgba(102, 126, 234, 0.3) 0%, transparent 100%)'
                  : 'transparent',
                borderLeft: isActive(item.path) ? '4px solid #667eea' : '4px solid transparent',
                marginBottom: '5px',
                justifyContent: isMinimized && !isMobile ? 'center' : 'flex-start'
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                }
              }}
            >
              <span style={{ 
                fontSize: '1.5em',
                marginRight: isMinimized && !isMobile ? '0' : '15px'
              }}>
                {item.icon}
              </span>
              {(!isMinimized || isMobile) && (
                <span style={{ fontWeight: isActive(item.path) ? '600' : '400' }}>
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div style={{
          padding: isMinimized && !isMobile ? '15px 10px' : '20px',
          borderTop: '2px solid rgba(255,255,255,0.1)',
          background: 'rgba(0,0,0,0.2)'
        }}>
          {(!isMinimized || isMobile) && (
            <div style={{
              marginBottom: '15px',
              padding: '10px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px'
            }}>
              <p style={{ 
                color: 'white', 
                margin: '0 0 5px 0',
                fontSize: '0.95em',
                fontWeight: '600'
              }}>
                {user?.username}
              </p>
              <p style={{ 
                color: 'rgba(255,255,255,0.6)', 
                margin: 0,
                fontSize: '0.85em'
              }}>
                {user?.role === 'admin' ? 'Administrator' : 'User'}
              </p>
            </div>
          )}
          <button
            onClick={onLogout}
            className="logout-btn"
            style={{
              width: '100%',
              padding: isMinimized && !isMobile ? '12px' : '12px 20px',
              background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: isMinimized && !isMobile ? '1.5em' : '0.95em',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 10px rgba(231, 76, 60, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 15px rgba(231, 76, 60, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 10px rgba(231, 76, 60, 0.3)';
            }}
          >
            <span>🚪</span>
            {(!isMinimized || isMobile) && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default ResponsiveSidebar;
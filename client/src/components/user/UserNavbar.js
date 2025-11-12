// File: client/src/components/user/UserNavbar.js

import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';

const UserNavbar = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin logout?')) {
      dispatch({ type: 'LOGOUT' });
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-header">
        <div style={{
          width: '60px',
          height: '60px',
          background: 'var(--accent-color)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 15px',
          fontSize: '1.5em',
          fontWeight: 'bold',
          color: 'white'
        }}>
          P
        </div>
        <h2>PMI Portal</h2>
        <p style={{ fontSize: '0.85em', opacity: 0.8 }}>Calon PMI</p>
      </div>
      
      <ul className="navbar-links">
        <li>
          <NavLink to="/user/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
            📊 Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/user/application/status" className={({ isActive }) => isActive ? "active" : ""}>
            📋 Status Aplikasi
          </NavLink>
        </li>
        <li>
          <NavLink to="/user/profile" className={({ isActive }) => isActive ? "active" : ""}>
            👤 Profil Saya
          </NavLink>
        </li>
      </ul>
      
      <div className="navbar-logout">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default UserNavbar;
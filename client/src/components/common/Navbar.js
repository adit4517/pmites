import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App'; // Sesuaikan path
// import logo from '../../assets/logo.png'; // Pastikan path logo benar

const Navbar = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-header">
        {/* <img src={logo} alt="Logo PMI" /> */}
        <h2>Sistem Rekap Data PMI Kabupaten Rembang</h2>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/input-pmi" className={({ isActive }) => isActive ? "active" : ""}>
            Input Data PMI
          </NavLink>
        </li>
        <li>
          <NavLink to="/data-pmi" className={({ isActive }) => isActive ? "active" : ""}>
            Data PMI
          </NavLink>
        </li>
      </ul>
      <div className="navbar-logout">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
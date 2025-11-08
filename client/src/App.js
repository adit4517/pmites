import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import InputPmiPage from './pages/InputPmiPage';
import DataPmiPage from './pages/DataPmiPage';
import Navbar from './components/common/Navbar'; // Akan dibuat
import './App.css'; // Global CSS

// Contoh sederhana AuthContext (bisa lebih kompleks)
export const AuthContext = React.createContext();

const initialState = {
  isAuthenticated: localStorage.getItem("token") ? true : false, // Cek token saat load
  user: null, // Bisa diisi data user setelah login
  token: localStorage.getItem("token") || null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        // user: action.payload.user // Jika API login mengembalikan data user
      };
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    default:
      return state;
  }
};


function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  // Komponen PrivateRoute untuk melindungi route yang butuh login
  const PrivateRoute = ({ children }) => {
    return state.isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      <Router>
        <div className="app-container">
          {state.isAuthenticated && <Navbar />} {/* Tampilkan Navbar jika sudah login */}
          <main className={state.isAuthenticated ? "main-content-with-navbar" : "main-content-full"}>
            <Routes>
              <Route path="/login" element={!state.isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
              <Route
                path="/dashboard"
                element={<PrivateRoute><DashboardPage /></PrivateRoute>}
              />
              <Route
                path="/input-pmi"
                element={<PrivateRoute><InputPmiPage /></PrivateRoute>}
              />
              <Route
                path="/data-pmi"
                element={<PrivateRoute><DataPmiPage /></PrivateRoute>}
              />
              <Route path="*" element={<Navigate to={state.isAuthenticated ? "/dashboard" : "/login"} />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
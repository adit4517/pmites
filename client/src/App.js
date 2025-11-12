// File: client/src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import InputPmiPage from './pages/admin/InputPmiPage';
import DataPmiPage from './pages/admin/DataPmiPage';

// User PMI Pages
import UserDashboard from './pages/user/UserDashboard';
import ApplicationForm from './pages/user/ApplicationForm';
import ApplicationEdit from './pages/user/ApplicationEdit';
import ApplicationStatus from './pages/user/ApplicationStatus';
import UserProfile from './pages/user/UserProfile';

// Components
import Navbar from './components/common/Navbar';
import UserNavbar from './components/user/UserNavbar';

import './App.css';

// AuthContext
export const AuthContext = React.createContext();

const initialState = {
  isAuthenticated: localStorage.getItem("token") ? true : false,
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user,
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

  // Private Route untuk Admin
  const AdminRoute = ({ children }) => {
    if (!state.isAuthenticated) {
      return <Navigate to="/login" />;
    }
    if (state.user?.role !== 'admin') {
      return <Navigate to="/user/dashboard" />;
    }
    return children;
  };

  // Private Route untuk User PMI
  const UserRoute = ({ children }) => {
    if (!state.isAuthenticated) {
      return <Navigate to="/login" />;
    }
    if (state.user?.role === 'admin') {
      return <Navigate to="/dashboard" />;
    }
    return children;
  };

  // Public Route (tidak boleh akses jika sudah login)
  const PublicRoute = ({ children }) => {
    if (state.isAuthenticated) {
      if (state.user?.role === 'admin') {
        return <Navigate to="/dashboard" />;
      }
      return <Navigate to="/user/dashboard" />;
    }
    return children;
  };

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      <Router>
        <div className="app-container">
          {/* Conditional Navbar */}
          {state.isAuthenticated && state.user?.role === 'admin' && <Navbar />}
          {state.isAuthenticated && state.user?.role === 'user' && <UserNavbar />}
          
          <main className={state.isAuthenticated ? "main-content-with-navbar" : "main-content-full"}>
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/" 
                element={
                  <PublicRoute>
                    <LandingPage />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                } 
              />

              {/* Admin Routes */}
              <Route
                path="/dashboard"
                element={
                  <AdminRoute>
                    <DashboardPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/input-pmi"
                element={
                  <AdminRoute>
                    <InputPmiPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/data-pmi"
                element={
                  <AdminRoute>
                    <DataPmiPage />
                  </AdminRoute>
                }
              />

              {/* User PMI Routes */}
              <Route
                path="/user/dashboard"
                element={
                  <UserRoute>
                    <UserDashboard />
                  </UserRoute>
                }
              />
              <Route
                path="/user/application/create"
                element={
                  <UserRoute>
                    <ApplicationForm />
                  </UserRoute>
                }
              />
              <Route
                path="/user/application/edit"
                element={
                  <UserRoute>
                    <ApplicationEdit />
                  </UserRoute>
                }
              />
              <Route
                path="/user/application/status"
                element={
                  <UserRoute>
                    <ApplicationStatus />
                  </UserRoute>
                }
              />
              <Route
                path="/user/profile"
                element={
                  <UserRoute>
                    <UserProfile />
                  </UserRoute>
                }
              />

              {/* Default Redirect */}
              <Route 
                path="*" 
                element={
                  <Navigate to={
                    state.isAuthenticated 
                      ? (state.user?.role === 'admin' ? "/dashboard" : "/user/dashboard")
                      : "/"
                  } />
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
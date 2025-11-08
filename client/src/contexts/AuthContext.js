import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios'; // Optional: for fetching user data on load if token exists

// Initial state: check local storage for token
const initialState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('token') || null,
  loading: true, // To check token validity on app load
};

// Action types
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGOUT = 'LOGOUT';
export const USER_LOADED = 'USER_LOADED'; // Optional: if you load user details
export const AUTH_ERROR = 'AUTH_ERROR'; // Optional: if user loading fails
export const SET_LOADING = 'SET_LOADING';

const authReducer = (state, action) => {
  switch (action.type) {
    case SET_LOADING:
        return {
            ...state,
            loading: true,
        };
    case USER_LOADED: // Optional
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
      };
    case LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`; // Set auth header for future requests
      return {
        ...state,
        ...action.payload, // Should contain token, possibly user
        isAuthenticated: true,
        loading: false,
      };
    case LOGIN_FAIL:
    case AUTH_ERROR: // Optional
    case LOGOUT:
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization']; // Remove auth header
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
        loading: false,
      };
    default:
      return state;
  }
};

export const AuthContext = createContext(initialState);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Optional: Try to load user if token exists (e.g., on page refresh)
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          // Replace with your actual endpoint to get user details
          // const res = await axios.get('http://localhost:5000/api/auth/user');
          // dispatch({ type: USER_LOADED, payload: res.data });
          // For now, if token exists, assume authenticated for simplicity
          // A proper implementation would verify the token with the backend
           dispatch({ type: USER_LOADED, payload: { /* mock user or decoded token data */ } });

        } catch (err) {
          dispatch({ type: AUTH_ERROR });
        }
      } else {
        dispatch({ type: SET_LOADING, payload: false }); // No token, not loading
         // dispatch({ type: AUTH_ERROR }); // Or this to ensure loading becomes false
      }
    };

    if(state.token && !state.isAuthenticated) { // Only load if token exists but not yet authenticated
        loadUser();
    } else {
        dispatch({ type: SET_LOADING, payload: false }); // Explicitly set loading to false if no token
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.token]); // Re-run if token changes (e.g. on login/logout)


  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {!state.loading ? children : <div>Loading Authentication...</div>}
    </AuthContext.Provider>
  );
};
import axios from "axios";

// Base URL for API
const url = import.meta.env.VITE_API_URL || "http://localhost:5000";
console.log("URL: ", url);
const API_URL = `${url}/api/users`;

// Add authorization header to requests
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

// Sign up user
const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);

    if (response.data.data.token) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      setAuthToken(response.data.data.token);
    }

    return response.data;
  } catch (error) {
    console.error(error.message);
  }
};

// Sign in user
const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signin`, userData);

    if (response.data.data.token) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      setAuthToken(response.data.data.token);
    }

    return response.data;
  } catch (error) {
    console.error(error.message);
  }
};

// Logout user
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setAuthToken(null);
};

// Check if user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

// Get current user from localStorage
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const authService = {
  register,
  login,
  logout,
  isAuthenticated,
  getCurrentUser,
  setAuthToken
};

export default authService;

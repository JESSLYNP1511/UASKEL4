import axios from 'axios';

const url = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${url}/api/products`;


// Set auth token for axios requests
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Get all products
const getAllProducts = async () => {
  const token = localStorage.getItem('token');
  setAuthToken(token);

  try {
    const response = await axios.get(API_URL);
    return response.data.data;
  } catch (error) {
    console.log(error.message)
  }
};

// Get user products
const getUserProducts = async () => {
  const token = localStorage.getItem('token');
  setAuthToken(token);

  try {
    const response = await axios.get(`${API_URL}/user/me`);
    return response.data.data;
  } catch (error) {
    console.log(error.message)
  }
};

// Get product by ID
const getProductById = async (id) => {
  const token = localStorage.getItem('token');
  setAuthToken(token);

  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data.data;
  } catch (error) {
    console.log(error.message)
  }
};

// Create new product
const createProduct = async (productData) => {
  const token = localStorage.getItem('token');
  setAuthToken(token);

  try {
    const response = await axios.post(API_URL, productData);
    return response.data.data;
  } catch (error) {
    console.log(error.message)
  }
};

// Update product
const updateProduct = async (id, productData) => {
  const token = localStorage.getItem('token');
  setAuthToken(token);

  try {
    const response = await axios.put(`${API_URL}/${id}`, productData);
    return response.data.data;
  } catch (error) {
    console.log(error.message)
  }
};

// Delete product
const deleteProduct = async (id) => {
  const token = localStorage.getItem('token');
  setAuthToken(token);

  try {
    await axios.delete(`${API_URL}/${id}`);
    return true;
  } catch (error) {
    console.log(error.message)
  }
};

const productService = {
  getAllProducts,
  getUserProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  setAuthToken
};

export default productService;

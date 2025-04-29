import React, { useState } from 'react';
import productService from '../services/product';
import './AddProductForm.css';

const AddProductForm = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { name, description, price, quantity } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price) {
      setError('Product name and price are required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Convert price and quantity to numbers
      const productData = {
        ...formData,
        price: Number(price),
        quantity: Number(quantity)
      };

      const newProduct = await productService.createProduct(productData);

      setSuccess('Product added successfully!');

      // Clear form
      setFormData({
        name: '',
        description: '',
        price: '',
        quantity: ''
      });

      // Notify parent component
      if (onProductAdded) {
        onProductAdded(newProduct);
      }

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);

    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Failed to add product. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <h2 className="form-title">Add New Product</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
            placeholder="Product Name"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="description"
            value={description}
            onChange={handleChange}
            placeholder="Description"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <input
            type="number"
            name="price"
            value={price}
            onChange={handleChange}
            placeholder="Price"
            className="form-input"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <input
            type="number"
            name="quantity"
            value={quantity}
            onChange={handleChange}
            placeholder="Quantity"
            className="form-input"
            min="0"
            required
          />
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;

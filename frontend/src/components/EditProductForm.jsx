import React, { useState, useEffect, useRef } from 'react';
import productService from '../services/product';
import './EditProductForm.css';

const EditProductForm = ({ product, onClose, onProductUpdated, onProductDeleted }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const modalRef = useRef(null);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        if (!loading && !success) {
          onClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [loading, success, onClose]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && !loading && !success) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [loading, success, onClose]);

  // Set initial form data
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        quantity: product.quantity || ''
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      setError('Product name and price are required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Convert price and quantity to numbers
      const productData = {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity)
      };

      const updatedProduct = await productService.updateProduct(product._id, productData);

      setSuccess('Product updated successfully!');

      // Notify parent component
      if (onProductUpdated) {
        onProductUpdated(updatedProduct);
      }

      // Clear success message and close modal after 1.5 seconds
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 1500);

    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Failed to update product. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    try {
      setLoading(true);
      setError('');

      await productService.deleteProduct(product._id);

      setSuccess('Product deleted successfully!');

      // Notify parent component
      if (onProductDeleted) {
        onProductDeleted(product._id);
      }

      // Close modal after 1.5 seconds
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Failed to delete product. Please try again.'
      );
      setDeleteConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(false);
  };

  return (
    <div className="edit-product-overlay">
      <div className="edit-product-modal" ref={modalRef}>
        <div className="modal-header">
          <h2>Edit Product</h2>
          <button
            className="close-button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
          >×</button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="edit-product-form">
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input"
              rows="3"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="form-input"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="form-input"
              min="0"
              required
            />
          </div>

          <div className="form-buttons">
            <button
              type="submit"
              className="update-button"
              disabled={loading}
            >
              {loading && !deleteConfirm ? 'Updating...' : 'Update Product'}
            </button>

            {!deleteConfirm ? (
              <button
                type="button"
                className="delete-button"
                onClick={handleDelete}
                disabled={loading}
              >
                Delete Product
              </button>
            ) : (
              <div className="delete-confirm">
                <p>Are you sure you want to delete this product?</p>
                <div className="confirm-buttons">
                  <button
                    type="button"
                    className="confirm-yes"
                    onClick={handleDelete}
                    disabled={loading}
                  >
                    {loading ? 'Deleting...' : 'Yes, Delete'}
                  </button>
                  <button
                    type="button"
                    className="confirm-no"
                    onClick={cancelDelete}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductForm;

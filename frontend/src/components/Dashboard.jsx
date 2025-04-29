import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import AddProductForm from './AddProductForm';
import EditProductForm from './EditProductForm';
import productService from '../services/product';
import './Dashboard.css';

const Dashboard = ({ setAuth }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    // Fetch user's products
    const fetchProducts = async () => {
      try {
        const data = await productService.getUserProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(false);
    navigate('/signin');
  };

  const handleProductAdded = (newProduct) => {
    setProducts([...products, newProduct]);
    // Switch to inventory tab to show the new product
    setActiveTab('inventory');
  };

  const handleEditProduct = (productId) => {
    const product = products.find(p => p._id === productId);
    if (product) {
      setSelectedProduct(product);
      setShowEditModal(true);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedProduct(null);
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts(products.map(p =>
      p._id === updatedProduct._id ? updatedProduct : p
    ));
  };

  const handleProductDeleted = (productId) => {
    setProducts(products.filter(p => p._id !== productId));
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="nailious-dashboard">
      <div className="sidebar">
        <h1 className="brand-name">NAILIOUS</h1>
        <div className="sidebar-buttons">
          <button
            className={`sidebar-btn ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            Inventory
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'add-product' ? 'active' : ''}`}
            onClick={() => setActiveTab('add-product')}
          >
            Add product
          </button>
          <button
            className="sidebar-btn logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="main-content">
        {activeTab === 'inventory' && (
          <>
            {products.length === 0 ? (
              <div className="no-products-message">
                <p>You don't have any products yet. Add some products to get started!</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onEdit={handleEditProduct}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'notifications' && (
          <div className="notifications">
            <p>You have no new notifications.</p>
          </div>
        )}

        {activeTab === 'add-product' && (
          <AddProductForm onProductAdded={handleProductAdded} />
        )}
      </div>

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <EditProductForm
          product={selectedProduct}
          onClose={handleCloseEditModal}
          onProductUpdated={handleProductUpdated}
          onProductDeleted={handleProductDeleted}
        />
      )}
    </div>
  );
};

export default Dashboard;

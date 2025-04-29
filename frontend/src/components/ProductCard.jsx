import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onEdit }) => {
  return (
    <div className="product-card">
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-stock">{product.quantity} Stock(s) left</p>
        <button
          className="edit-btn"
          onClick={() => onEdit(product._id)}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

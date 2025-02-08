import React from 'react';
import PropTypes from 'prop-types'; // Import de PropTypes

const ProductsTable = ({ products, handleEdit, handleDelete }) => {
  return (
    <div className="mb-4">
      <h2>Products</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Category</th>
            <th>Image</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.title}</td>
              <td>{product.price}</td>
              <td>{product.category}</td>
              <td><img src={product.image} alt={product.title} width="50" /></td>
              <td>{product.quantity}</td>
              <td>{product.status}</td>
              <td>
                <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(product.id, 'products')}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product.id, 'products')}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Validation des props
ProductsTable.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired, // products doit être un tableau d'objets avec ces propriétés
  handleEdit: PropTypes.func.isRequired, // handleEdit doit être une fonction
  handleDelete: PropTypes.func.isRequired, // handleDelete doit être une fonction
};

export default ProductsTable;

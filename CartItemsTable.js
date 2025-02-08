import React from 'react';
import PropTypes from 'prop-types'; // Importation de PropTypes

const CartItemsTable = ({ cartItems, handleEdit, handleDelete }) => {
  console.log('Rendering CartItemsTable with cart items:', cartItems);

  return (
    <div className="mb-4">
      <h2>Cart Items</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Image</th>
            <th>User ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item, index) => (
            <tr key={`${item.id}-${index}`}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.category}</td>
              <td>{item.price}</td>
              <td>{item.quantity}</td>
              <td>{item.status}</td>
              <td>
                <img src={item.image} alt={item.title} style={{ width: '50px', height: '50px' }} />
              </td>
              <td>{item.userId}</td>
              <td>
                <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(item.id, 'cart')}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id, 'cart')}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Validation des props
CartItemsTable.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
    })
  ).isRequired, // cartItems doit être un tableau d'objets avec ces propriétés
  handleEdit: PropTypes.func.isRequired, // handleEdit doit être une fonction
  handleDelete: PropTypes.func.isRequired, // handleDelete doit être une fonction
};

export default CartItemsTable;

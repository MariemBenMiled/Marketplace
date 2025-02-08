import React from 'react';
import PropTypes from 'prop-types'; // Import de PropTypes

const UsersTable = ({ users, handleEdit, handleDelete }) => {
  console.log('Rendering UsersTable with users:', users);

  return (
    <div className="mb-4">
      <h2>Users</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Display Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.displayName}</td>
              <td>{user.email}</td>
              <td>
                <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(user.id)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Validation des props
UsersTable.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    })
  ).isRequired, // users doit être un tableau d'objets avec les propriétés id, displayName, et email
  handleEdit: PropTypes.func.isRequired, // handleEdit doit être une fonction
  handleDelete: PropTypes.func.isRequired, // handleDelete doit être une fonction
};

export default UsersTable;

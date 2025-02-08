import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PropTypes from 'prop-types'; // Import de PropTypes

const PrivateRoute = ({ adminOnly = false, component: Component, ...rest }) => {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while checking auth status
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  return <Component {...rest} />;
};

// Ajouter la validation des props
PrivateRoute.propTypes = {
  adminOnly: PropTypes.bool,
  component: PropTypes.elementType.isRequired, // Validation de 'component' comme un composant React
};

export default PrivateRoute;

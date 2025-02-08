import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const products = [
  { id: 1, title: 'Shoes', category: 'shoes' },
  { id: 2, title: 'Coats', category: 'coats' },
  { id: 3, title: 'Women Bags', category: 'women-bags' }, // Ensure this matches Firestore
  // Add other products as needed
];

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query') || '';
  const category = queryParams.get('category') || '';

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) {
        navigate('/signup'); // Redirect to signup page if user is not logged in
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="container py-5">
        <h2 className="text-center mb-4">Loading...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-5">
        <h2 className="text-center mb-4">Please Sign Up or Log In</h2>
      </div>
    );
  }

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(query.toLowerCase()) &&
    (category === '' || product.category === category)
  );

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Search Results</h2>
      <ul className="list-group">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <li key={product.id} className="list-group-item">
              {product.title}
            </li>
          ))
        ) : (
          <li className="list-group-item">No products found</li>
        )}
      </ul>
    </div>
  );
};

export default SearchResults;

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { auth } from '../firebase'; // Removed 'db' as it's not used
import { onAuthStateChanged } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const products = [
  { id: 1, image: 'https://media.istockphoto.com/id/508493926/photo/fashion-beige-child-girl-trench-coat-isolated-on-white.jpg?s=612x612&w=0&k=20&c=w5T839hbsXQ35xI1ByVYMn_c7ZL8TKYJr5R0LB_uKA4=', title: 'Trench coat', price: '250', category: 'women', status: 'Sale' },
  { id: 2, image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80', title: 'Chic Shoulder Bag', price: '150', category: 'women', status: 'Sale' },
  { id: 3, image: 'https://plus.unsplash.com/premium_photo-1671718111684-9142a70a5fe0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHNob2VzfGVufDB8fDB8fHww', title: 'High Boots', price: '150', category: 'women', status: 'Sale' },
  { id: 4, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQJpAMj3ComBWqFpa25QJOmZxOMBCJ7xN9Aw&s', title: 'Back Bag', price: '150', category: 'women', status: 'Sale' },
  { id: 5, image: 'https://media.istockphoto.com/id/1665707222/fr/photo/jeune-femme-marchant-dans-un-parc-dhiver-enneig%C3%A9-v%C3%AAtue-dun-manteau-bleu-une-fille-aime-le.webp?a=1&b=1&s=612x612&w=0&k=20&c=iJgV8uPkpXs5pfRvxk5kKT0yYcHlpBijBoIOikfTrAk=', title: 'Puffer Jacket', price: '150', category: 'women', status: 'Sale' },
  { id: 6, image: 'https://media.istockphoto.com/id/1787366749/fr/photo/la-femme-choisit-et-ach%C3%A8te-des-bottines-en-cuir-avec-un-talon-dans-un-magasin-de-chaussures.webp?a=1&b=1&s=612x612&w=0&k=20&c=u7J09TeIXfCL97t1w6m7oR84rOhhEORKbPYiqzul_nw=', title: 'Boots', price: '150', category: 'women', status: 'Sale' },
  { id: 7, image: 'https://plus.unsplash.com/premium_photo-1670963025497-d6d582ea9319?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', title: 'Bucket Bag', price: '150', category: 'women', status: 'Sale' },
  { id: 8, image: 'https://plus.unsplash.com/premium_photo-1698952163284-8ab2e22a5dd4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGxlYXRoZXIlMjBqYWNrZXR8ZW58MHx8MHx8fDA%3D', title: 'Leather Jacket', price: '150', category: 'women', status: 'Sale' },
];

const ProductGrid = () => {
  const { addToCart } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const [popupProduct, setPopupProduct] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleAddToCart = (product) => {
    if (user) {
      addToCart({ ...product, quantity: 1 }, user.uid); // Pass user ID here
      setPopupProduct(product);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    } else {
      toast.info("Please sign up or log in to add items to the cart.");
      navigate('/signup'); // Redirect to the signup page
    }
  };

  return (
    <section className="py-4">
      <div className="container">
        <h2 className="text-center mb-4">Chic Style for Women</h2>
        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-md-3 mb-4">
              <div className="card h-100"> {/* Ensures all cards have the same height */}
                <div className="position-relative"> {/* Create a positioning context for the badge */}
                  <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.title}
                    style={{ height: '200px', objectFit: 'cover' }} // Fixed height for images
                  />
                  <span className={`badge bg-danger position-absolute top-0 end-0 m-2`}>
                    {product.status}
                  </span>
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">{product.price} Dt</p>
                  <p className="text-muted">{product.category}</p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="btn btn-primary mt-auto"
                    disabled={!user} // Disable button if user is not authenticated
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {showPopup && (
          <div className="alert alert-success text-center" role="alert">
            {popupProduct && popupProduct.title} has been added to your cart!
          </div>
        )}
      </div>
      <ToastContainer
        position="top-left"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </section>
  );
};

export default ProductGrid;

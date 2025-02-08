import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { ToastContainer, toast } from 'react-toastify';
import { auth, db } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import 'react-toastify/dist/ReactToastify.css';

const initialProducts = [
  { id: 1, image: 'https://media.istockphoto.com/id/508493926/photo/fashion-beige-child-girl-trench-coat-isolated-on-white.jpg?s=612x612&w=0&k=20&c=w5T839hbsXQ35xI1ByVYMn_c7ZL8TKYJr5R0LB_uKA4=', title: 'Winter Coat', price: 150, category: 'coats', status: 'New' },
  { id: 2, image: 'https://plus.unsplash.com/premium_photo-1698952163284-8ab2e22a5dd4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGxlYXRoZXIlMjBqYWNrZXR8ZW58MHx8MHx8fDA%3D', title: 'Leather Jacket', price: 200, category: 'coats', status: 'Sale' },
  { id: 3, image: 'https://media.istockphoto.com/id/1665707222/fr/photo/jeune-femme-marchant-dans-un-parc-dhiver-enneig%C3%A9-v%C3%AAtue-dun-manteau-bleu-une-fille-aime-le.webp?a=1&b=1&s=612x612&w=0&k=20&c=iJgV8uPkpXs5pfRvxk5kKT0yYcHlpBijBoIOikfTrAk=', title: 'Raincoat', price: 120, category: 'coats', status: 'Best Seller' },
];

const Coats = () => {
  const { addToCart } = useCart();
  const [coatsProducts, setCoatsProducts] = useState(initialProducts);
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products from Firestore...');
        const q = query(collection(db, 'products'), where('category', '==', 'coats'));
        const querySnapshot = await getDocs(q);
        const productsData = [];
        querySnapshot.forEach((doc) => {
          productsData.push({ id: doc.id, ...doc.data() });
        });
        console.log('Fetched products:', productsData);
        setCoatsProducts((prevProducts) => [...initialProducts, ...productsData]);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (user) {
      if (!product.title || !product.price || !product.image) {
        toast.error("Product information is incomplete.");
        console.error("Product information is incomplete", product);
        return;
      }
      addToCart({ ...product, quantity: 1 }, user.uid);
      setPopupProduct(product);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    } else {
      toast.info("Please sign up or log in to add items to the cart.");
    }
  };

  return (
    <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <h2 className="text-center mb-4">Stylish Coats for Women</h2>
        <div className="row">
          {coatsProducts.map((coat) => (
            <div key={coat.id} className="col-md-4 mb-4">
              <div className="card shadow-sm border-light">
                <div className="position-relative">
                  <img
                    src={coat.image}
                    className="card-img-top"
                    alt={coat.title}
                    style={{ height: '250px', objectFit: 'cover' }}
                  />
                  <span className="badge bg-primary position-absolute top-0 start-0 m-2">{coat.status}</span>
                </div>
                <div className="card-body">
                  <h5 className="card-title">{coat.title}</h5>
                  <p className="card-text">{coat.price} Dt</p>
                  <button
                    className="btn btn-success w-100"
                    onClick={() => handleAddToCart(coat)}
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
      </div>
    </section>
  );
};

export default Coats;

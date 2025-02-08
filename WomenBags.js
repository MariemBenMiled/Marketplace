import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { ToastContainer, toast } from 'react-toastify';
import { auth, db } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import 'react-toastify/dist/ReactToastify.css';

const initialProducts = [
  { id: 1, image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80', title: 'Tote Bag', price: 80, category: 'bags', status: 'New' },
  { id: 2, image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', title: 'Backpack', price: 90, category: 'bags', status: 'Best Seller' },
  { id: 3, image: 'https://images.unsplash.com/photo-1583623733237-4d5764a9dc82?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', title: 'Bucket Bag', price: 85, category: 'bags', status: 'Trending' },
];

const WomenBags = () => {
  const { addToCart } = useCart();
  const [bagsProducts, setBagsProducts] = useState(initialProducts);
  const [showPopup, setShowPopup] = useState(false);
  const [popupProduct, setPopupProduct] = useState(null);
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
        console.log("Fetching products from Firestore...");
        const q = query(collection(db, 'products'), where('category', '==', 'women-bags'));
        const querySnapshot = await getDocs(q);
        const productsData = [];
        querySnapshot.forEach((doc) => {
          console.log('Fetched doc:', doc.data());
          productsData.push({ id: doc.id, ...doc.data() });
        });
        console.log('Fetched products:', productsData);
        setBagsProducts((prevProducts) => [...initialProducts, ...productsData]);
        console.log('Updated products list:', [...initialProducts, ...productsData]);
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
        <h2 className="text-center mb-4">Chic Women’s Bags</h2>
        <div className="row">
          {bagsProducts.map((bag) => (
            <div key={bag.id} className="col-md-4 mb-4">
              <div className="card shadow-sm border-light">
                <div className="position-relative">
                  <img
                    src={bag.image}
                    className="card-img-top"
                    alt={bag.title}
                    style={{ height: '250px', objectFit: 'cover' }}
                  />
                  <span className="badge bg-primary position-absolute top-0 start-0 m-2">{bag.status}</span>
                </div>
                <div className="card-body">
                  <h5 className="card-title">{bag.title}</h5>
                  <p className="card-text">{bag.price} Dt</p>
                  <button
                    className="btn btn-success w-100"
                    onClick={() => handleAddToCart(bag)}
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

export default WomenBags;

import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { ToastContainer, toast } from 'react-toastify';
import { auth, db } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import 'react-toastify/dist/ReactToastify.css';

const initialProducts = [
  { id: 1, image: 'https://media.istockphoto.com/id/1436061606/photo/flying-colorful-womens-sneaker-isolated-on-white-background-fashionable-stylish-sports-shoe.jpg?s=612x612&w=0&k=20&c=2KKjX9tXo0ibmBaPlflnJNdtZ-J77wrprVStaPL2Gj4=', title: 'Running Shoes', price: 100, category: 'shoes', status: 'New' },
  { id: 2, image: 'https://media.istockphoto.com/id/846681586/fr/photo/bottes-%C3%A0-talon-haut.webp?a=1&b=1&s=612x612&w=0&k=20&c=pBRFt7xBomVSoPEbI_-YU6n-F6H-h0BWHfnmJWVMjJA=', title: 'Leather Shoes', price: 120, category: 'shoes', status: 'Sale' },
  { id: 3, image: 'https://media.istockphoto.com/id/1130229822/fr/photo/la-mode-baskets-blancs.webp?a=1&b=1&s=612x612&w=0&k=20&c=JV-nBQSQb9mm0TubfeNtYYtBjU99-Lwe3-7sfCWX-AU=', title: 'Casual Sneakers', price: 80, category: 'shoes', status: 'Best Seller' },
];

const Shoes = () => {
  const { addToCart } = useCart();
  const [shoesProducts, setShoesProducts] = useState(initialProducts);
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
        console.log('Fetching products from Firestore...');
        const q = query(collection(db, 'products'), where('category', '==', 'shoes'));
        const querySnapshot = await getDocs(q);
        const productsData = [];
        querySnapshot.forEach((doc) => {
          productsData.push({ id: doc.id, ...doc.data() });
        });
        console.log('Fetched products:', productsData);
        setShoesProducts((prevProducts) => {
          return [...initialProducts, ...productsData];
        });
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
        <h2 className="text-center mb-4">Stylish Shoes for Women</h2>
        <div className="row">
          {shoesProducts.map((shoe) => (
            <div key={shoe.id} className="col-md-4 mb-4">
              <div className="card shadow-sm border-light">
                <div className="position-relative">
                  <img
                    src={shoe.image}
                    className="card-img-top"
                    alt={shoe.title}
                    style={{ height: '250px', objectFit: 'cover' }}
                  />
                  <span className="badge bg-primary position-absolute top-0 start-0 m-2">{shoe.status}</span>
                </div>
                <div className="card-body">
                  <h5 className="card-title">{shoe.title}</h5>
                  <p className="card-text">{shoe.price} Dt</p>
                  <button
                    className="btn btn-success w-100"
                    onClick={() => handleAddToCart(shoe)}
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

export default Shoes;

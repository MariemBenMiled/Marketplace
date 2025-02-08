import React, { useState, useEffect } from 'react';
import { ShoppingBag, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import './Header.css'; // Import your CSS file

const Header = () => {
  const {  isAdmin } = useAuth(); // Get current user and admin status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { cart } = useCart();
  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);
  const [userDropdownVisible, setUserDropdownVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUsername(user.displayName || 'User');
      } else {
        setIsLoggedIn(false);
        setUsername('');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSearch = () => {
    if (!isLoggedIn) {
      toast.info("Please sign up or log in to search.");
      navigate('/login');
      return;
    }
    
    const query = searchQuery.toLowerCase();
    if (query === 'shoes') {
      navigate('/elements/shoes');
    } else if (query === 'coats') {
      navigate('/elements/coats');
    } else if (query === 'women bags' || query === 'womenbags') {
      navigate('/elements/WomenBags');
    } else {
      toast.error("No matching category found.", { autoClose: 2000 });
    }
  };

  const handleLogout = () => {
    auth.signOut();
    setIsLoggedIn(false);
    setUsername('');
    setUserDropdownVisible(false);
    toast.success("You've successfully logged out.", { autoClose: 2000 });
  };

  const handleCategorySelect = (category) => {
    if (category === '') {
      navigate('/');
    } else {
      navigate(`/elements/${category}`);
    }
  };

  return (
    <header className="bg-dark text-white py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <img src="Glamory.png" alt="Logo" className="me-2" style={{ width: '40px', height: '40px' }} />
          <div className="fs-2 fw-bold">Glamory</div>
        </div>
        <nav>
          <ul className="nav">
            <li className="nav-item"><Link to="/" className="nav-link text-white">Home</Link></li>
            <li className="nav-item"><Link to="/dashboard" className="nav-link text-white">Dashboard</Link></li>
            <li className="nav-item"><Link to="/shop" className="nav-link text-white">Shop</Link></li>
            <li className="nav-item dropdown">
              <div
                className="nav-link text-white dropdown-toggle"
                onMouseEnter={() => setCategoryDropdownVisible(true)}
                onMouseLeave={() => setCategoryDropdownVisible(false)}
                style={{ cursor: 'pointer' }}
              >
                Elements
              </div>
              {categoryDropdownVisible && (
                <ul className="dropdown-menu show" onMouseEnter={() => setCategoryDropdownVisible(true)} onMouseLeave={() => setCategoryDropdownVisible(false)}>
                  <li><div className="dropdown-item" onClick={() => handleCategorySelect('')}>All Categories</div></li>
                  <li><div className="dropdown-item" onClick={() => handleCategorySelect('shoes')}>Shoes</div></li>
                  <li><div className="dropdown-item" onClick={() => handleCategorySelect('coats')}>Coats</div></li>
                  <li><div className="dropdown-item" onClick={() => handleCategorySelect('women-bags')}>Women Bags</div></li>
                </ul>
              )}
            </li>
            <li className="nav-item"><Link to="/blog" className="nav-link text-white">Blog</Link></li>
            <li className="nav-item"><Link to="/add-product" className="nav-link text-white">Add Product</Link></li>
          </ul>
        </nav>
        <div className="d-flex align-items-center">
          <div className="input-group me-3">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
            />
            <select className="form-select" onChange={(e) => handleCategorySelect(e.target.value)}>
              <option value="">All Categories</option>
              <option value="shoes">Shoes</option>
              <option value="coats">Coats</option>
              <option value="women-bags">Women Bags</option>
            </select>
            <button onClick={handleSearch} className="btn btn-primary">Search</button>
          </div>
          <Link to="/cart" className="position-relative me-3" aria-label="Shopping Cart">
            <ShoppingBag style={{ width: '24px', height: '24px' }} />
            {cart.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </Link>
          {isLoggedIn ? (
            <>
              <div className="d-flex align-items-center dropdown-toggle" onClick={() => setUserDropdownVisible(!userDropdownVisible)} style={{ cursor: 'pointer' }}>
                <User style={{ width: '24px', height: '24px' }} />
                <span className="ms-2">{username} {isAdmin && '(Admin)'}</span> {/* Display admin status */}
              </div>
              {userDropdownVisible && (
                <ul className="dropdown-menu show">
                  <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                </ul>
              )}
            </>
          ) : (
            <div className="d-flex">
              <Link to="/login" className="me-2 text-white">Login</Link>
              <span>|</span>
              <Link to="/signup" className="ms-2 text-white">Signup</Link>
            </div>
          )}
        </div>
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
    </header>
  );
};

export default Header;

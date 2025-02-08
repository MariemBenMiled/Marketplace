import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import StripeCheckout from 'react-stripe-checkout';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
  const { 
    cart, 
    clearCart, 
    getCartTotal, 
    incrementQuantity, 
    decrementQuantity, 
    removeFromCart, 
    fetchCartData 
  } = useCart();

  const [user, setUser] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchCartData(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, [fetchCartData]);

  useEffect(() => {
    if (paymentMethod === 'sendEmail') {
      setIsFormValid(address.trim() !== '' && phoneNumber.trim() !== '');
    }
  }, [address, phoneNumber, paymentMethod]);

  const handleAuthAction = (action) => {
    if (user) {
      action();
    } else {
      toast.info("Please sign up or log in to perform this action.");
      navigate('/signup');
    }
  };

  const addOrder = async (orderData) => {
    try {
      await addDoc(collection(db, 'orders'), orderData);
      toast.success('Order successfully added!');
    } catch (error) {
      console.error('Error adding order:', error);
      toast.error('Failed to place order. Try again.');
    }
  };

  const handleCheckout = async (token) => {
    try {
      if (!paymentMethod) {
        toast.error("Please select a payment method before proceeding.");
        return;
      }

      const orderData = {
        userId: user.uid,
        items: cart,
        totalAmount: getCartTotal(),
        createdAt: new Date(),
        status: paymentMethod === 'delivery' ? 'Awaiting Delivery' : 'Pending',
        paymentMethod: paymentMethod,
        token: token ? token.id : null,
        email: user.email,
        address: address, // Ajout de l'adresse
        phoneNumber: phoneNumber, // Ajout du numéro de téléphone
      };

      await addOrder(orderData);

      if (paymentMethod === 'sendEmail') {
        await fetch('http://localhost:3001/api/sendOrderConfirmationEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userName: user.displayName || user.email,
            userEmail: user.email,
            totalQty: cart.reduce((acc, item) => acc + item.quantity, 0),
            totalAmount: getCartTotal(),
            address: address, // Envoi de l'adresse
            phoneNumber: phoneNumber, // Envoi du numéro de téléphone
          }),
        });
        toast.success("Order confirmed, and email sent!");
        setTimeout(() => {
          navigate('/');
        }, 1000 * 1000); 
      }

      clearCart(user.uid);
      navigate('/confirmation');
    } catch (error) {
      console.error('Checkout Error: ', error);
      toast.error('Error processing your order. Please try again.');
    }
  };

  const handleProceedToCheckout = () =>
    handleAuthAction(() => {
      if (paymentMethod === 'stripe') {
        setShowPayment(true);
      } else if (paymentMethod === 'delivery' || paymentMethod === 'sendEmail') {
        handleCheckout();
      } else {
        toast.error("Please select a valid payment method.");
      }
    });

  const handleIncrement = (itemId) =>
    handleAuthAction(() => incrementQuantity(itemId, user.uid));
  const handleDecrement = (itemId) =>
    handleAuthAction(() => decrementQuantity(itemId, user.uid));
  const handleRemove = (itemId) =>
    handleAuthAction(() => removeFromCart(itemId, user.uid));

  if (!user) return <p>Loading user information...</p>;

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Your Shopping Cart</h1>
      {cart.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Product</th>
                  <th scope="col">Price</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Total</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="img-thumbnail"
                        style={{ width: '100px' }}
                      />
                      <p>{item.title}</p>
                    </td>
                    <td>{item.price} Dt</td>
                    <td>
                      <div className="d-flex">
                        <button
                          onClick={() => handleDecrement(item.id)}
                          className="btn btn-outline-secondary btn-sm"
                        >
                          -
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          onClick={() => handleIncrement(item.id)}
                          className="btn btn-outline-secondary btn-sm"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>{item.price * item.quantity} Dt</td>
                    <td>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center mt-4">
            <p className="h4">Total: {getCartTotal()} Dt</p>
            <select
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="form-select mb-3"
            >
              <option value="">Select Payment Method</option>
              <option value="stripe">Pay with Stripe</option>
              <option value="delivery">Pay on Delivery</option>
              <option value="sendEmail">Send Email</option>
            </select>

            {paymentMethod === 'sendEmail' && (
              <>
                <input
                  type="text"
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="form-control mb-3"
                />
                <input
                  type="text"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="form-control mb-3"
                />
              </>
            )}

            <button
              onClick={handleProceedToCheckout}
              className="btn btn-success"
              disabled={paymentMethod === 'sendEmail' && !isFormValid}
            >
              Proceed to Checkout
            </button>

            {showPayment && paymentMethod === 'stripe' && (
              <StripeCheckout
                stripeKey="pk_test_51OIueRFpJCdRhGdytThPzHTm1lHLU7UPuCZMrj0FhIbrvSpwz42g0JDkrBFrHgSXBmkUJ3Xm4CiA4dMe6xrvOPFO0031GdrvSV"
                name="Glamory"
                amount={getCartTotal() * 100}
                label="Pay Now"
                description={`Your total is ${getCartTotal()} Dt`}
                token={handleCheckout}
                email={user?.email}
              />
            )}
          </div>
        </>
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
        icon={false}
      />
    </div>
  );
};

export default Cart;

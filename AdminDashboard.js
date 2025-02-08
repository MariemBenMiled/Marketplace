import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAuth, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import UsersTable from './UsersTable';
import ProductsTable from './ProductsTable';
import CartItemsTable from './CartItemsTable';

const AdminDashboard = () => {
  const { currentUser, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!isAdmin) {
      navigate('/');
      return;
    }

    fetchUsers();
    fetchProducts();
    fetchCartItems();
  }, [currentUser, isAdmin, navigate]);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsList);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCartItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'cart'));
      const cartItemsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCartItems(cartItemsList);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const handleEdit = async (id, collectionName) => {
    const fieldName = prompt("Enter the field name you want to edit:");
    if (!fieldName) {
      console.error('No field name provided');
      return;
    }
  
    const newValue = prompt(`Enter new value for ${fieldName}:`);
    if (newValue !== null) {
      console.log(`Field ${fieldName} edited to ${newValue}`);
  
      // Update the state directly without updating Firestore
      switch (collectionName) {
        case 'users':
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === id ? { ...user, [fieldName]: newValue } : user
            )
          );
          break;
        case 'products':
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product.id === id ? { ...product, [fieldName]: newValue } : product
            )
          );
          break;
        case 'cart':
          setCartItems((prevCartItems) =>
            prevCartItems.map((cartItem) =>
              cartItem.id === id ? { ...cartItem, [fieldName]: newValue } : cartItem
            )
          );
          break;
        default:
          console.error('Unknown collection name');
      }
    } else {
      console.error('No new value provided');
    }
  };
  

  const handleDelete = async (id, collectionName) => {
    try {
      const itemRef = doc(db, collectionName, id);
      await deleteDoc(itemRef);
      console.log('Item deleted');

      // Update the state directly without re-fetching data from Firestore
      if (collectionName === 'users') {
        setUsers((prevUsers) => prevUsers.filter(user => user.id !== id));
      } else if (collectionName === 'products') {
        setProducts((prevProducts) => prevProducts.filter(product => product.id !== id));
      } else if (collectionName === 'cart') {
        setCartItems((prevCartItems) => prevCartItems.filter(cartItem => cartItem.id !== id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const refreshToken = () => {
    const auth = getAuth();
    const email = 'wissalwisou@gmail.com'; // Replace with the admin user's email
    const password = '372003'; // Replace with the admin user's password

    signOut(auth).then(() => {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log('User signed in.');
          return userCredential.user.getIdTokenResult(true); // Force refresh token
        })
        .then((idTokenResult) => {
          if (idTokenResult.claims.admin) {
            console.log('Admin claim is present');
          } else {
            console.log('Admin claim is not present');
          }
        })
        .catch((error) => {
          console.error('Error signing in:', error);
        });
    });
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  if (currentUser && !isAdmin) {
    return <div>Access Denied</div>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={refreshToken}>Refresh Token</button>
      <UsersTable users={users} handleEdit={(id) => handleEdit(id, 'users')} handleDelete={(id) => handleDelete(id, 'users')} />
      <ProductsTable products={products} handleEdit={(id) => handleEdit(id, 'products')} handleDelete={(id) => handleDelete(id, 'products')} />
      <CartItemsTable cartItems={cartItems} handleEdit={(id) => handleEdit(id, 'cart')} handleDelete={(id) => handleDelete(id, 'cart')} />
    </div>
  );
};

export default AdminDashboard;

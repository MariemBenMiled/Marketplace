import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const AddProduct = () => {
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState(''); // Default status
  const [image, setImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!image) throw new Error("Please upload an image.");
      const storageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(storageRef, image);
      const imageUrl = await getDownloadURL(storageRef);
      await addDoc(collection(db, 'products'), {
        title,
        price: parseFloat(price),
        category,
        image: imageUrl,
        status,  // Add the status field
        userId: currentUser.uid,
      });
      setSuccessMessage('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error.code, error.message, error.details);
      setSuccessMessage(`Error adding product: ${error.message}`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!currentUser) return <Navigate to="/login" />;

  return (
    <div className="container mt-5">
      <h1 className="h3 mb-4">Add a New Product</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <div>
            <input
              type="radio"
              id="shoes"
              name="category"
              value="shoes"
              checked={category === 'shoes'}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <label htmlFor="shoes" className="ms-2 me-3">Shoes</label>
            <input
              type="radio"
              id="women-bags"
              name="category"
              value="women-bags"
              checked={category === 'women-bags'}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <label htmlFor="women-bags" className="ms-2 me-3">Women Bags</label>
            <input
              type="radio"
              id="coats"
              name="category"
              value="coats"
              checked={category === 'coats'}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <label htmlFor="coats" className="ms-2 me-3">Coats</label>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Product Status</label>
          <input
            type="text"
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Product Image</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleImageChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Product
        </button>
      </form>
      {successMessage && <div className="alert alert-success mt-4">{successMessage}</div>}
    </div>
  );
};

export default AddProduct;

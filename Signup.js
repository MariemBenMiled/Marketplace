import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });

      // Add user to Firestore with their role
      await setDoc(doc(db, 'users', user.uid), {
        userId: user.uid,
        email: user.email,
        displayName: name,
        role: 'user', // Default role
        createdAt: serverTimestamp(),
      });

      console.log('Updated User:', user.displayName);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow" style={{ width: '450px', borderRadius: '15px', padding: '20px' }}>
        <h1 className="h3 mb-4 text-center">Sign Up</h1>
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              autoComplete="name" // Added autocomplete attribute
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoComplete="email" // Added autocomplete attribute
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="new-password" // Added autocomplete attribute
            />
          </div>
          {error && <p className="text-danger">{error}</p>}
          <button
            type="submit"
            className={`btn btn-success w-100 ${loading ? 'disabled' : ''}`}
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;

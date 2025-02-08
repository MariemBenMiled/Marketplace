import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { currentUser, isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if already logged in as admin
    if (currentUser && isAdmin) {
      navigate('/admin-dashboard');
    }
  }, [currentUser, isAdmin, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          email: user.email,
          role: 'user',
        });
      }

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow" style={{ width: '450px', borderRadius: '15px', padding: '20px' }}>
        <h1 className="h3 mb-4 text-center">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <div className="input-group">
              <span className="input-group-text"><FaEnvelope /></span>
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
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text"><FaLock /></span>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password" // Added autocomplete attribute
              />
            </div>
          </div>
          {error && <p className="text-danger">{error}</p>}
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;

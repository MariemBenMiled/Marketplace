import React from 'react';
import { Facebook, Twitter, Instagram, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-3 mb-4">
            <h3 className="h5 font-weight-bold mb-4">Glamory</h3>
            <p className="mb-4">www.Glamory.com</p>
            <div className="d-flex">
              <a href="#" className="text-white me-3"><Github size={24} /></a>
              <a href="#" className="text-white me-3"><Facebook size={24} /></a>
              <a href="#" className="text-white me-3"><Twitter size={24} /></a>
              <a href="#" className="text-white"><Instagram size={24} /></a>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <h3 className="h5 font-weight-bold mb-4">Locate Us</h3>
            <p>Tunis, Tunisia, Ariana</p>
            <p>Mobile: 28******</p>
            <p>Phone: 29******</p>
            <p>Email: glamory@gmail.com</p>
          </div>
          <div className="col-md-3 mb-4">
            <h3 className="h5 font-weight-bold mb-4">Profile</h3>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white text-decoration-none">My Account</a></li>
              <li><a href="#" className="text-white text-decoration-none">Checkout</a></li>
              <li><a href="#" className="text-white text-decoration-none">Order Tracking</a></li>
              <li><a href="#" className="text-white text-decoration-none">Help & Support</a></li>
            </ul>
          </div>
          <div className="col-md-3 mb-4">
            <h3 className="h5 font-weight-bold mb-4">Newsletter</h3>
            <p className="mb-4">Subscribe to our newsletter for the latest updates and offers.</p>
            <form className="d-flex">
              <input type="email" placeholder="Enter your email" className="form-control me-2" />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

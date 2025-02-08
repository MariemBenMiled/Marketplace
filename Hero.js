import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const images = [
  "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  "https://media.istockphoto.com/id/1483470105/fr/photo/figure-f%C3%A9minine-dans-le-long-pardessus-brun-portrait-en-plein-air-%C3%A0-la-lumi%C3%A8re-du-jour.webp?a=1&b=1&s=612x612&w=0&k=20&c=l6yPPig7y-o2PYFtASW156D6Smn4Iki2ZwfIJ9VRz1I=",
  "https://www.eastpak.com/media/catalog/product/cache/7e86b16e927e7bf256b2e257717508c0/E/K/EK000620_0O9_ALT001_1.jpg",
  "https://images.unsplash.com/photo-1676379827610-c380c52db0c6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDgzfHx8ZW58MHx8fHx8",
];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  // Change image every 3 seconds
  useEffect(() => {
    const interval = setInterval(nextImage, 3000);
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <section className="position-relative bg-light py-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 mb-4 mb-md-0">
            <div className="bg-warning text-dark d-inline-block px-3 py-1 mb-3">
              <span className="fw-bold">Get 15% off</span>
            </div>
            <h1 className="display-4 fw-bold mb-3">Your First Fashion Order</h1>
            <p className="mb-2">Use the code: 15OFF</p>
            <p className="text-muted mb-2">Easy and FREE Returns*</p>
            <p className="text-muted small">*T&Cs apply</p>
          </div>
          <div className="col-md-6 position-relative">
            <div style={{ height: '400px', overflow: 'hidden' }}>
              <img
                src={images[currentImage]}
                alt="Fashion items"
                className="img-fluid rounded shadow-lg"
                style={{ 
                  height: '100%', 
                  width: '100%',  // Ensure the image fills the container
                  objectFit: 'cover' // Maintain aspect ratio while covering the entire container
                }} 
              />
            </div>
          </div>
        </div>
      </div>
      <div className="position-absolute bottom-0 end-0 d-flex gap-2 me-3 mb-3">
        <button onClick={prevImage} className="btn btn-light shadow-sm rounded-circle p-2">
          <ChevronLeft className="icon-sm" />
        </button>
        <button onClick={nextImage} className="btn btn-light shadow-sm rounded-circle p-2">
          <ChevronRight className="icon-sm" />
        </button>
      </div>
    </section>
  );
};

export default Hero;

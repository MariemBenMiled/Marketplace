import React from 'react';
import ProductGrid from '../components/ProductGrid';

const Shop = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shop Our Collection</h1>
      <ProductGrid />
    </div>
  );
};

export default Shop;
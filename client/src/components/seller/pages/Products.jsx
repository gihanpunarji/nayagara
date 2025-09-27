import React from 'react';
import SellerLayout from '../layout/SellerLayout';
import ProductList from '../products/ProductList';

const Products = () => {
  return (
    <SellerLayout>
      <ProductList />
    </SellerLayout>
  );
};

export default Products;
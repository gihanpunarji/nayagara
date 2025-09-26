import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SellerLayout from '../layout/SellerLayout';
import ProductForm from '../products/ProductForm';

const EditProduct = () => {
  const { id } = useParams();
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock product data - in real app, fetch from API
    const mockProduct = {
      id,
      title: 'iPhone 14 Pro Max 256GB Space Black',
      description: 'Brand new iPhone 14 Pro Max with original warranty',
      price: '450000',
      category: 'Electronics',
      subcategory: 'Mobile Phones',
      stock: '5',
      status: 'approved',
      images: [
        {
          id: 1,
          url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
          name: 'iphone-main.jpg',
          size: 85000
        }
      ],
      dynamicFields: {
        brand: 'Apple',
        model: 'iPhone 14 Pro Max',
        storage: '256GB',
        ram: '6GB',
        color: 'Space Black',
        condition: 'New'
      }
    };

    // Simulate API call delay
    setTimeout(() => {
      setProductData(mockProduct);
      setIsLoading(false);
    }, 500);
  }, [id]);

  if (isLoading) {
    return (
      <SellerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <ProductForm isEdit={true} productData={productData} />
    </SellerLayout>
  );
};

export default EditProduct;
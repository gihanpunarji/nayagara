import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SellerLayout from '../layout/SellerLayout';
import ProductForm from '../products/ProductForm';
import api from '../../../api/axios';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        const response = await api.get(`/products/${id}`);
        
        if (response.data.success) {
          const product = response.data.data.product;
          const images = response.data.data.images;
          
          // Transform data to match form structure
          const formattedProduct = {
            id: product.product_id,
            title: product.product_title,
            description: product.product_description,
            price: product.price.toString(),
            category: product.category_id.toString(),
            subcategory: product.category_id.toString(), // Using same as category_id since API stores subcategory_id as category_id
            stock: product.stock_quantity.toString(),
            status: product.product_status,
            weightKg: product.weight_kg,
            locationCityId: product.location_city_id,
            metaTitle: product.meta_title,
            metaDescription: product.meta_description,
            images: images.map(img => ({
              id: img.image_id,
              url: `http://localhost:5001${img.image_url}`,
              name: img.image_alt || 'Product Image',
              size: 0 // We don't have size info from API
            })),
            dynamicFields: product.product_attributes || {}
          };
          
          setProductData(formattedProduct);
        } else {
          setError(response.data.message || 'Failed to load product');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        if (error.response?.status === 404) {
          setError('Product not found');
        } else if (error.response?.status === 403) {
          setError('You do not have permission to edit this product');
        } else {
          setError(error.response?.data?.message || 'Failed to load product');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (isLoading) {
    return (
      <SellerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Loading product...</span>
        </div>
      </SellerLayout>
    );
  }

  if (error) {
    return (
      <SellerLayout>
        <div className="max-w-4xl mx-auto text-center py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Product</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/seller/products')}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Back to Products
            </button>
          </div>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <ProductForm isEdit={true} productData={productData} productId={id} />
    </SellerLayout>
  );
};

export default EditProduct;
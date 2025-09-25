// 📦 EXAMPLE: Seller Products Hook
// This shows how to create a custom hook for product management
// Usage: const { products, addProduct, updateProduct, deleteProduct } = useProducts();

import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all products for the seller
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/seller/products');
      setProducts(response.data.products);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Add new product
  const addProduct = useCallback(async (productData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/seller/products', productData);
      const newProduct = response.data.product;

      setProducts(prevProducts => [...prevProducts, newProduct]);
      return { success: true, product: newProduct };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add product';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update existing product
  const updateProduct = useCallback(async (productId, updateData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.put(`/seller/products/${productId}`, updateData);
      const updatedProduct = response.data.product;

      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === productId ? updatedProduct : product
        )
      );
      return { success: true, product: updatedProduct };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update product';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete product
  const deleteProduct = useCallback(async (productId) => {
    setLoading(true);
    setError(null);

    try {
      await api.delete(`/seller/products/${productId}`);

      setProducts(prevProducts =>
        prevProducts.filter(product => product.id !== productId)
      );
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete product';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle product status (active/inactive)
  const toggleProductStatus = useCallback(async (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return { success: false, error: 'Product not found' };

    return await updateProduct(productId, {
      status: product.status === 'active' ? 'inactive' : 'active'
    });
  }, [products, updateProduct]);

  // Get products by category
  const getProductsByCategory = useCallback((category) => {
    return products.filter(product => product.category === category);
  }, [products]);

  // Get low stock products (stock < 5)
  const getLowStockProducts = useCallback(() => {
    return products.filter(product => product.stock < 5);
  }, [products]);

  // Calculate total revenue from products
  const totalRevenue = products.reduce((sum, product) => {
    return sum + (product.price * (product.sold || 0));
  }, 0);

  return {
    // State
    products,
    loading,
    error,

    // Actions
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    fetchProducts,

    // Computed/Helper functions
    getProductsByCategory,
    getLowStockProducts,

    // Statistics
    totalRevenue,
    totalProducts: products.length,
    activeProducts: products.filter(p => p.status === 'active').length,
    lowStockCount: products.filter(p => p.stock < 5).length
  };
};

// 🎯 HOW TO USE IN COMPONENTS:
/*
import { useProducts } from '../hooks/seller/useProducts';

function ProductList() {
  const {
    products,
    loading,
    deleteProduct,
    getLowStockProducts
  } = useProducts();

  const handleDelete = async (productId) => {
    if (confirm('Are you sure?')) {
      const result = await deleteProduct(productId);
      if (result.success) {
        toast.success('Product deleted successfully');
      } else {
        toast.error(result.error);
      }
    }
  };

  const lowStockProducts = getLowStockProducts();

  if (loading) return <div>Loading products...</div>;

  return (
    <div>
      {lowStockProducts.length > 0 && (
        <div className="alert">
          {lowStockProducts.length} products are low on stock!
        </div>
      )}

      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>Stock: {product.stock}</p>
          <button onClick={() => handleDelete(product.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
*/
import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Upload, X, GripVertical, Eye, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ImageUploader from './ImageUploader';
import api from '../../../api/axios';

const ProductForm = ({ isEdit = false, productData = null, productId = null }) => {
  const navigate = useNavigate();

  // Product form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    stock: '',
    status: 'active',
    images: [],
    // Dynamic fields will be added based on category
    ...{}
  });

  const [dynamicFields, setDynamicFields] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Category data from database
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [categoryFields, setCategoryFields] = useState([]);
  const [loading, setLoading] = useState({
    categories: false,
    subCategories: false,
    fields: false
  });

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Load categories from API
  const loadCategories = async () => {
    try {
      setLoading(prev => ({ ...prev, categories: true }));
      const response = await api.get('/categories');
      
      if (response.data.success) {
        setCategories(response.data.data);
      } else {
        console.error('Failed to load categories:', response.data.message);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  };

  // Load subcategories when category changes
  const loadSubCategories = async (categoryId) => {
    try {
      setLoading(prev => ({ ...prev, subCategories: true }));
      const response = await api.get(`/categories/${categoryId}/subcategories`);
      
      if (response.data.success) {
        setSubCategories(response.data.data);
      } else {
        console.error('Failed to load subcategories:', response.data.message);
        setSubCategories([]);
      }
    } catch (error) {
      console.error('Error loading subcategories:', error);
      setSubCategories([]);
    } finally {
      setLoading(prev => ({ ...prev, subCategories: false }));
    }
  };

  // Load category fields when subcategory changes
  const loadCategoryFields = async (subCategoryId) => {
    try {
      setLoading(prev => ({ ...prev, fields: true }));
      const response = await api.get(`/subcategories/${subCategoryId}/fields`);
      
      if (response.data.success) {
        setCategoryFields(response.data.data);
        
        // Initialize dynamic fields
        const initialFields = {};
        response.data.data.forEach(field => {
          initialFields[field.field_name] = '';
        });
        setDynamicFields(initialFields);
      } else {
        console.error('Failed to load category fields:', response.data.message);
        setCategoryFields([]);
        setDynamicFields({});
      }
    } catch (error) {
      console.error('Error loading category fields:', error);
      setCategoryFields([]);
      setDynamicFields({});
    } finally {
      setLoading(prev => ({ ...prev, fields: false }));
    }
  };

  // Update form data when editing
  useEffect(() => {
    if (isEdit && productData) {
      setFormData({
        title: productData.title || '',
        description: productData.description || '',
        price: productData.price || '',
        category: productData.category || '',
        subcategory: productData.subcategory || '',
        stock: productData.stock || '',
        status: productData.status || 'active',
        images: productData.images || [],
        weightKg: productData.weightKg || '',
        locationCityId: productData.locationCityId || '',
        metaTitle: productData.metaTitle || '',
        metaDescription: productData.metaDescription || ''
      });
      setDynamicFields(productData.dynamicFields || {});
      
      // Load category data for editing
      if (productData.category) {
        loadSubCategories(productData.category);
      }
      if (productData.subcategory) {
        loadCategoryFields(productData.subcategory);
      }
    }
  }, [isEdit, productData]);

  // Handle category change to show relevant fields
  const handleCategoryChange = (categoryId) => {
    const selectedCategory = categories.find(cat => cat.category_id == categoryId);
    
    setFormData(prev => ({
      ...prev,
      category: categoryId,
      subcategory: ''
    }));
    
    setSubCategories([]);
    setCategoryFields([]);
    setDynamicFields({});
    
    if (categoryId) {
      loadSubCategories(categoryId);
    }
  };

  // Handle subcategory change to show dynamic fields
  const handleSubcategoryChange = (subCategoryId) => {
    setFormData(prev => ({
      ...prev,
      subcategory: subCategoryId
    }));

    setCategoryFields([]);
    setDynamicFields({});
    
    if (subCategoryId) {
      loadCategoryFields(subCategoryId);
    }
  };

  // Handle dynamic field changes
  const handleDynamicFieldChange = (fieldName, value) => {
    setDynamicFields(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      const newErrors = {};

      if (!formData.title) newErrors.title = 'Title is required';
      if (!formData.description) newErrors.description = 'Description is required';
      if (!formData.price) newErrors.price = 'Price is required';
      if (!isEdit && !formData.category) newErrors.category = 'Category is required';
      if (!isEdit && !formData.subcategory) newErrors.subcategory = 'Subcategory is required';
      if (!formData.stock) newErrors.stock = 'Stock quantity is required';
      if (!isEdit && formData.images.length === 0) newErrors.images = 'At least one image is required';

      // Dynamic fields are now optional - sellers can include details in description instead
      // No validation for dynamic fields

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsSubmitting(false);
        return;
      }

      // Prepare form data for submission
      const formDataToSubmit = new FormData();
      
      // Add basic product data
      formDataToSubmit.append('title', formData.title);
      formDataToSubmit.append('description', formData.description);
      formDataToSubmit.append('price', formData.price);
      formDataToSubmit.append('stock', formData.stock);
      
      // Add optional fields
      if (formData.weightKg) formDataToSubmit.append('weightKg', formData.weightKg);
      if (formData.locationCityId) formDataToSubmit.append('locationCityId', formData.locationCityId);
      if (formData.metaTitle) formDataToSubmit.append('metaTitle', formData.metaTitle);
      if (formData.metaDescription) formDataToSubmit.append('metaDescription', formData.metaDescription);
      
      // Only add category/subcategory for create mode
      if (!isEdit) {
        formDataToSubmit.append('category', formData.category);
        formDataToSubmit.append('subcategory', formData.subcategory);
      }
      
      // Add dynamic fields
      formDataToSubmit.append('dynamicFields', JSON.stringify(dynamicFields));
      
      // Add new images only
      formData.images.forEach((image, index) => {
        if (image.file) {
          formDataToSubmit.append('images', image.file);
        }
      });

      // Submit to API
      const url = isEdit ? `/products/${productId}` : '/products';
      const method = isEdit ? 'put' : 'post';
      
      const response = await api[method](url, formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        console.log(`Product ${isEdit ? 'updated' : 'created'} successfully:`, response.data.data);
        // Navigate back to products list
        navigate('/seller/products');
      } else {
        setErrors({ submit: response.data.message || `Failed to ${isEdit ? 'update' : 'create'} product` });
      }

    } catch (error) {
      console.error('Error submitting product:', error);
      setErrors({ 
        submit: error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} product. Please try again.` 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpdate = (images) => {
    setFormData(prev => ({ ...prev, images }));
  };

  // Render dynamic fields based on selected category and subcategory
  const renderDynamicFields = () => {
    if (!formData.category || !formData.subcategory || categoryFields.length === 0) {
      return null;
    }

    if (loading.fields) {
      return (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    return categoryFields.map((field) => (
      <div key={field.field_id} className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          {field.field_label}
          <span className="text-gray-500 text-xs ml-1">(Optional)</span>
        </label>

        {field.field_type === 'select' ? (
          <select
            value={dynamicFields[field.field_name] || ''}
            onChange={(e) => handleDynamicFieldChange(field.field_name, e.target.value)}
            disabled={isEdit}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors[field.field_name] ? 'border-red-500' : 'border-gray-300'
            } ${isEdit ? 'bg-gray-100' : ''}`}
          >
            <option value="">Select {field.field_label}</option>
            {field.field_options && field.field_options.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        ) : field.field_type === 'number' ? (
          <input
            type="number"
            value={dynamicFields[field.field_name] || ''}
            onChange={(e) => handleDynamicFieldChange(field.field_name, e.target.value)}
            disabled={isEdit}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors[field.field_name] ? 'border-red-500' : 'border-gray-300'
            } ${isEdit ? 'bg-gray-100' : ''}`}
            placeholder={`Enter ${field.field_label}`}
          />
        ) : (
          <input
            type="text"
            value={dynamicFields[field.field_name] || ''}
            onChange={(e) => handleDynamicFieldChange(field.field_name, e.target.value)}
            disabled={isEdit}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors[field.field_name] ? 'border-red-500' : 'border-gray-300'
            } ${isEdit ? 'bg-gray-100' : ''}`}
            placeholder={`Enter ${field.field_label}`}
          />
        )}

        {errors[field.field_name] && (
          <p className="text-red-500 text-sm">{errors[field.field_name]}</p>
        )}
      </div>
    ));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            to="/seller/products"
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEdit ? 'Update your product details' : 'Create a new product listing'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, status: prev.status === 'active' ? 'draft' : 'active' }))}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>Preview</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{errors.submit}</p>
          </div>
        )}

        {/* Basic Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Title */}
            <div className="lg:col-span-2 space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter a descriptive title for your product"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>

            {/* Product Description */}
            <div className="lg:col-span-2 space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe your product in detail"
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>

            {/* ProductCost*/}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Product Cost (Rs.) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
            </div>

             {/* Price */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Price (Rs.) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
            </div>

            {/* Stock */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.stock ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
                min="0"
              />
              {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}
            </div>

            {/* Weight */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Product Weight <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.stock ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.0"
                min="0"
              />
              {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}
            </div>

          </div>
        </div>

        {/* Category Selection */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Category</h2>
            {isEdit && (
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Cannot be changed when editing
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main Category */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                disabled={loading.categories || isEdit}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                } ${(loading.categories || isEdit) ? 'bg-gray-100' : ''}`}
              >
                <option value="">
                  {loading.categories ? 'Loading categories...' : 'Select Category'}
                </option>
                {categories.map(category => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
            </div>

            {/* Subcategory */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Subcategory <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.subcategory}
                onChange={(e) => handleSubcategoryChange(e.target.value)}
                disabled={!formData.category || loading.subCategories || isEdit}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.subcategory ? 'border-red-500' : 'border-gray-300'
                } ${(!formData.category || loading.subCategories || isEdit) ? 'bg-gray-100' : ''}`}
              >
                <option value="">
                  {loading.subCategories ? 'Loading subcategories...' : 'Select Subcategory'}
                </option>
                {subCategories.map(subCategory => (
                  <option key={subCategory.sub_category_id} value={subCategory.sub_category_id}>
                    {subCategory.sub_category_name}
                  </option>
                ))}
              </select>
              {errors.subcategory && <p className="text-red-500 text-sm">{errors.subcategory}</p>}
            </div>
          </div>
        </div>

        {/* Dynamic Fields */}
        {formData.category && formData.subcategory && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {subCategories.find(sub => sub.sub_category_id == formData.subcategory)?.sub_category_name || 'Category'} Details
              </h2>
              <div className="flex items-center space-x-2">
                {isEdit && (
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Cannot be changed when editing
                  </span>
                )}
                <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  All fields optional
                </span>
              </div>
            </div>

            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                💡 <strong>Tip:</strong> These fields are optional. You can leave them empty and include all product details in the description instead.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {renderDynamicFields()}
            </div>
          </div>
        )}

        {/* Images */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Product Images</h2>
          <p className="text-gray-600 mb-4">Add up to 10 images. The first image will be used as the main product image.</p>

          <ImageUploader
            images={formData.images}
            onUpdate={handleImageUpdate}
            maxImages={10}
            error={errors.images}
          />

          {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images}</p>}
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-6">
          <Link
            to="/seller/products"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
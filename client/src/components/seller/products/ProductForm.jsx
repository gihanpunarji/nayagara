import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Upload, X, GripVertical, Eye, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ImageUploader from './ImageUploader';

const ProductForm = ({ isEdit = false, productData = null }) => {
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

  // Category definitions with dynamic fields
  const categories = {
    'Electronics': {
      subcategories: ['Mobile Phones', 'Laptops', 'TVs', 'Cameras', 'Audio', 'Gaming'],
      fields: {
        'Mobile Phones': [
          { name: 'brand', label: 'Brand', type: 'select', options: ['Samsung', 'Apple', 'Xiaomi', 'OnePlus', 'Google', 'Other'], required: true },
          { name: 'model', label: 'Model', type: 'text', required: true },
          { name: 'storage', label: 'Storage', type: 'select', options: ['64GB', '128GB', '256GB', '512GB', '1TB'], required: true },
          { name: 'ram', label: 'RAM', type: 'select', options: ['4GB', '6GB', '8GB', '12GB', '16GB'], required: true },
          { name: 'color', label: 'Color', type: 'text', required: false },
          { name: 'condition', label: 'Condition', type: 'select', options: ['New', 'Used - Like New', 'Used - Good', 'Used - Fair'], required: true }
        ],
        'Laptops': [
          { name: 'brand', label: 'Brand', type: 'select', options: ['Dell', 'HP', 'Asus', 'Acer', 'Lenovo', 'Apple', 'MSI', 'Other'], required: true },
          { name: 'processor', label: 'Processor', type: 'text', required: true },
          { name: 'ram', label: 'RAM', type: 'select', options: ['4GB', '8GB', '16GB', '32GB', '64GB'], required: true },
          { name: 'storage', label: 'Storage', type: 'text', required: true },
          { name: 'screenSize', label: 'Screen Size', type: 'select', options: ['13"', '14"', '15.6"', '17"', 'Other'], required: false },
          { name: 'condition', label: 'Condition', type: 'select', options: ['New', 'Used - Like New', 'Used - Good', 'Used - Fair'], required: true }
        ]
      }
    },
    'Vehicles': {
      subcategories: ['Cars', 'Motorcycles', 'Auto Parts', 'Accessories'],
      fields: {
        'Cars': [
          { name: 'make', label: 'Make', type: 'select', options: ['Toyota', 'Honda', 'Nissan', 'Suzuki', 'Mitsubishi', 'Hyundai', 'BMW', 'Mercedes', 'Other'], required: true },
          { name: 'model', label: 'Model', type: 'text', required: true },
          { name: 'year', label: 'Year', type: 'select', options: Array.from({length: 30}, (_, i) => String(2024 - i)), required: true },
          { name: 'mileage', label: 'Mileage (km)', type: 'number', required: true },
          { name: 'fuelType', label: 'Fuel Type', type: 'select', options: ['Petrol', 'Diesel', 'Hybrid', 'Electric'], required: true },
          { name: 'transmission', label: 'Transmission', type: 'select', options: ['Manual', 'Automatic', 'CVT'], required: true },
          { name: 'engineCapacity', label: 'Engine Capacity (cc)', type: 'number', required: false },
          { name: 'color', label: 'Color', type: 'text', required: false },
          { name: 'condition', label: 'Condition', type: 'select', options: ['Brand New', 'Used - Excellent', 'Used - Good', 'Used - Fair'], required: true }
        ],
        'Motorcycles': [
          { name: 'make', label: 'Make', type: 'select', options: ['Honda', 'Yamaha', 'Suzuki', 'Bajaj', 'TVS', 'Royal Enfield', 'Other'], required: true },
          { name: 'model', label: 'Model', type: 'text', required: true },
          { name: 'year', label: 'Year', type: 'select', options: Array.from({length: 20}, (_, i) => String(2024 - i)), required: true },
          { name: 'mileage', label: 'Mileage (km)', type: 'number', required: true },
          { name: 'engineCapacity', label: 'Engine Capacity (cc)', type: 'select', options: ['100cc', '125cc', '150cc', '200cc', '250cc', '300cc+'], required: true },
          { name: 'condition', label: 'Condition', type: 'select', options: ['Brand New', 'Used - Excellent', 'Used - Good', 'Used - Fair'], required: true }
        ]
      }
    },
    'Fashion': {
      subcategories: ['Men\'s Clothing', 'Women\'s Clothing', 'Shoes', 'Accessories', 'Bags'],
      fields: {
        'Men\'s Clothing': [
          { name: 'size', label: 'Size', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'], required: true },
          { name: 'color', label: 'Color', type: 'text', required: true },
          { name: 'material', label: 'Material', type: 'text', required: false },
          { name: 'brand', label: 'Brand', type: 'text', required: false },
          { name: 'condition', label: 'Condition', type: 'select', options: ['New with Tags', 'New without Tags', 'Used - Like New', 'Used - Good'], required: true }
        ],
        'Shoes': [
          { name: 'size', label: 'Size', type: 'select', options: Array.from({length: 15}, (_, i) => String(35 + i)), required: true },
          { name: 'brand', label: 'Brand', type: 'text', required: false },
          { name: 'color', label: 'Color', type: 'text', required: true },
          { name: 'gender', label: 'Gender', type: 'select', options: ['Men', 'Women', 'Unisex'], required: true },
          { name: 'condition', label: 'Condition', type: 'select', options: ['New', 'Used - Like New', 'Used - Good', 'Used - Fair'], required: true }
        ]
      }
    },
    'Home & Living': {
      subcategories: ['Furniture', 'Appliances', 'Decor', 'Kitchen', 'Garden'],
      fields: {
        'Furniture': [
          { name: 'material', label: 'Material', type: 'select', options: ['Wood', 'Metal', 'Plastic', 'Glass', 'Fabric', 'Leather', 'Other'], required: false },
          { name: 'color', label: 'Color', type: 'text', required: false },
          { name: 'dimensions', label: 'Dimensions (L×W×H)', type: 'text', required: false },
          { name: 'condition', label: 'Condition', type: 'select', options: ['New', 'Used - Excellent', 'Used - Good', 'Used - Fair'], required: true }
        ],
        'Appliances': [
          { name: 'brand', label: 'Brand', type: 'text', required: false },
          { name: 'model', label: 'Model', type: 'text', required: false },
          { name: 'powerConsumption', label: 'Power Consumption', type: 'text', required: false },
          { name: 'warranty', label: 'Warranty Remaining', type: 'text', required: false },
          { name: 'condition', label: 'Condition', type: 'select', options: ['New', 'Used - Excellent', 'Used - Good', 'Used - Fair'], required: true }
        ]
      }
    }
  };

  // Update form data when editing
  useEffect(() => {
    if (isEdit && productData) {
      setFormData(productData);
      setDynamicFields(productData.dynamicFields || {});
    }
  }, [isEdit, productData]);

  // Handle category change to show relevant fields
  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      category,
      subcategory: ''
    }));
    setDynamicFields({});
  };

  // Handle subcategory change to show dynamic fields
  const handleSubcategoryChange = (subcategory) => {
    setFormData(prev => ({
      ...prev,
      subcategory
    }));

    // Reset dynamic fields when subcategory changes
    const fields = categories[formData.category]?.fields?.[subcategory] || [];
    const initialFields = {};
    fields.forEach(field => {
      initialFields[field.name] = '';
    });
    setDynamicFields(initialFields);
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
      if (!formData.category) newErrors.category = 'Category is required';
      if (!formData.subcategory) newErrors.subcategory = 'Subcategory is required';
      if (!formData.stock) newErrors.stock = 'Stock quantity is required';
      if (formData.images.length === 0) newErrors.images = 'At least one image is required';

      // Validate dynamic fields
      const fields = categories[formData.category]?.fields?.[formData.subcategory] || [];
      fields.forEach(field => {
        if (field.required && !dynamicFields[field.name]) {
          newErrors[field.name] = `${field.label} is required`;
        }
      });

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsSubmitting(false);
        return;
      }

      // Submit product data
      const productData = {
        ...formData,
        dynamicFields,
        status: 'pending' // All products start as pending approval
      };

      // TODO: API call to create/update product
      console.log('Submitting product:', productData);

      // Navigate back to products list
      navigate('/seller/products');

    } catch (error) {
      console.error('Error submitting product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpdate = (images) => {
    setFormData(prev => ({ ...prev, images }));
  };

  // Render dynamic fields based on selected category and subcategory
  const renderDynamicFields = () => {
    if (!formData.category || !formData.subcategory) return null;

    const fields = categories[formData.category]?.fields?.[formData.subcategory] || [];

    return fields.map((field) => (
      <div key={field.name} className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {field.type === 'select' ? (
          <select
            value={dynamicFields[field.name] || ''}
            onChange={(e) => handleDynamicFieldChange(field.name, e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors[field.name] ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select {field.label}</option>
            {field.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : field.type === 'number' ? (
          <input
            type="number"
            value={dynamicFields[field.name] || ''}
            onChange={(e) => handleDynamicFieldChange(field.name, e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors[field.name] ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={`Enter ${field.label}`}
          />
        ) : (
          <input
            type="text"
            value={dynamicFields[field.name] || ''}
            onChange={(e) => handleDynamicFieldChange(field.name, e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors[field.name] ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={`Enter ${field.label}`}
          />
        )}

        {errors[field.name] && (
          <p className="text-red-500 text-sm">{errors[field.name]}</p>
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
          </div>
        </div>

        {/* Category Selection */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Category</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main Category */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Category</option>
                {Object.keys(categories).map(category => (
                  <option key={category} value={category}>{category}</option>
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
                disabled={!formData.category}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.subcategory ? 'border-red-500' : 'border-gray-300'
                } ${!formData.category ? 'bg-gray-100' : ''}`}
              >
                <option value="">Select Subcategory</option>
                {formData.category && categories[formData.category]?.subcategories?.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
              {errors.subcategory && <p className="text-red-500 text-sm">{errors.subcategory}</p>}
            </div>
          </div>
        </div>

        {/* Dynamic Fields */}
        {formData.category && formData.subcategory && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              {formData.subcategory} Details
            </h2>

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
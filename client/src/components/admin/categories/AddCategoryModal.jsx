import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import api from '../../../api/axios';

const AddCategoryModal = ({ isOpen, onClose, onSuccess, editingCategory }) => {
  const [categoryName, setCategoryName] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [icon, setIcon] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [icoFile, setIcoFile] = useState(null);
  const [icoFileName, setIcoFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill form when editing
  React.useEffect(() => {
    if (editingCategory) {
      setCategoryName(editingCategory.name || '');
      setCategorySlug(editingCategory.slug || editingCategory.category_slug || '');
      // Set icon preview if it exists
      if (editingCategory.icon) {
        setIconPreview(editingCategory.icon);
      }
    } else {
      // Reset form when not editing
      setCategoryName('');
      setCategorySlug('');
      setIcon(null);
      setIconPreview(null);
      setIcoFile(null);
      setIcoFileName('');
    }
  }, [editingCategory]);

  const handleNameChange = (e) => {
    const name = e.target.value;
    setCategoryName(name);
    // Auto-generate slug
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    setCategorySlug(slug);
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setIcon(file);
      setIconPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleIcoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (fileExtension !== 'ico') {
        setError('Please select a .ico file only');
        return;
      }
      if (file.size > 1 * 1024 * 1024) {
        setError('ICO file size must be less than 1MB');
        return;
      }
      setIcoFile(file);
      setIcoFileName(file.name);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName || !categorySlug) {
      setError('Category name and slug are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('categoryName', categoryName);
      formData.append('categorySlug', categorySlug);
      if (icon) {
        formData.append('icon', icon);
      }
      if (icoFile) {
        formData.append('icoFile', icoFile);
      }

      let response;
      if (editingCategory) {
        // Update existing category
        response = await api.put(`/admin/categories/${editingCategory.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Create new category
        response = await api.post('/admin/categories', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      if (response.data.success) {
        onSuccess();
        handleClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${editingCategory ? 'update' : 'add'} category`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCategoryName('');
    setCategorySlug('');
    setIcon(null);
    setIconPreview(null);
    setIcoFile(null);
    setIcoFileName('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={handleNameChange}
              placeholder="e.g., Electronics"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          {/* Category Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Slug *
            </label>
            <input
              type="text"
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              placeholder="e.g., electronics"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              URL-friendly version of the category name
            </p>
          </div>

          {/* Category Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Icon (Image)
            </label>
            <div className="flex items-center space-x-4">
              {iconPreview ? (
                <div className="relative">
                  <img
                    src={iconPreview}
                    alt="Category icon preview"
                    className="w-20 h-20 object-cover rounded-lg border-2 border-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIcon(null);
                      setIconPreview(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <label className="flex-1 cursor-pointer">
                <div className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">
                    {icon ? 'Change Image' : 'Upload Image'}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIconChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Recommended: Square image, max 5MB
            </p>
          </div>

          {/* Icon File (.ico) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon File (.ico)
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                {icoFileName ? (
                  <div className="text-center px-2">
                    <span className="text-xs text-green-600 font-medium break-all">
                      {icoFileName.length > 15 ? icoFileName.substring(0, 12) + '...' : icoFileName}
                    </span>
                  </div>
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <label className="cursor-pointer block">
                  <div className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">
                      {icoFile ? 'Change ICO File' : 'Upload ICO File'}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept=".ico"
                    onChange={handleIcoFileChange}
                    className="hidden"
                  />
                </label>
                {icoFile && (
                  <button
                    type="button"
                    onClick={() => {
                      setIcoFile(null);
                      setIcoFileName('');
                    }}
                    className="w-full px-4 py-1 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Remove ICO File
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Only .ico files allowed, max 1MB
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
              disabled={loading}
            >
              {loading
                ? (editingCategory ? 'Updating...' : 'Adding...')
                : (editingCategory ? 'Update Category' : 'Add Category')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;

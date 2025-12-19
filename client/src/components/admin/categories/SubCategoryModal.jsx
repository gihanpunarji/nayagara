import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Loader } from 'lucide-react';
import api from '../../../api/axios';

const SubCategoryModal = ({ isOpen, onClose, category, onSuccess }) => {
  const [subcategories, setSubcategories] = useState([]);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (isOpen && category) {
      fetchSubcategories();
    }
  }, [isOpen, category]);

  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/categories/${category.id}/subcategories`);
      if (response.data.success) {
        setSubcategories(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch subcategories:', err);
      setError('Failed to load subcategories');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubcategory = async () => {
    if (!newSubcategoryName.trim()) {
      setError('Subcategory name is required');
      return;
    }

    try {
      setAdding(true);
      setError('');
      const response = await api.post('/admin/subcategories', {
        categoryId: category.id,
        subCategoryName: newSubcategoryName.trim()
      });

      if (response.data.success) {
        setNewSubcategoryName('');
        fetchSubcategories();
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add subcategory');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteSubcategory = async (subcategoryId) => {
    if (!window.confirm('Are you sure you want to delete this subcategory?')) {
      return;
    }

    try {
      setDeletingId(subcategoryId);
      setError('');
      const response = await api.delete(`/admin/subcategories/${subcategoryId}`);

      if (response.data.success) {
        fetchSubcategories();
        onSuccess();
      }
    } catch (err) {
      console.log('Delete error:', err);
      console.log('Error response:', err.response);

      // Check if error is due to products existing
      const status = err.response?.status;
      const message = err.response?.data?.message || '';

      if (status === 409 || message.toLowerCase().includes('product')) {
        setError('⚠️ Cannot delete this subcategory because it has products associated with it. Please remove or reassign the products first.');
      } else {
        setError(message || 'Failed to delete subcategory. Please try again.');
      }

      // Scroll error into view
      setTimeout(() => {
        document.querySelector('.bg-red-50')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    } finally {
      setDeletingId(null);
    }
  };

  const handleClose = () => {
    setNewSubcategoryName('');
    setError('');
    onClose();
  };

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Manage Subcategories</h2>
            <p className="text-sm text-gray-600 mt-1">Category: {category.name}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-300 text-red-800 px-5 py-4 rounded-lg mb-6 flex items-start shadow-lg animate-pulse">
              <div className="flex-shrink-0 mr-3">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-bold text-base">Error</p>
                <p className="text-sm mt-1 leading-relaxed">{error}</p>
              </div>
              <button
                onClick={() => setError('')}
                className="flex-shrink-0 ml-3 text-red-500 hover:text-red-700 transition-colors"
                title="Dismiss"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Add New Subcategory */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add New Subcategory
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newSubcategoryName}
                onChange={(e) => setNewSubcategoryName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSubcategory()}
                placeholder="Enter subcategory name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                disabled={adding}
              />
              <button
                onClick={handleAddSubcategory}
                disabled={adding || !newSubcategoryName.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 flex items-center space-x-2"
              >
                {adding ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Existing Subcategories */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Existing Subcategories ({subcategories.length})
            </h3>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="w-6 h-6 animate-spin text-green-600" />
              </div>
            ) : subcategories.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-600">No subcategories found</p>
                <p className="text-sm text-gray-500 mt-1">Add your first subcategory above</p>
              </div>
            ) : (
              <div className="space-y-2">
                {subcategories.map((subcategory) => (
                  <div
                    key={subcategory.sub_category_id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-green-300 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{subcategory.sub_category_name}</p>
                      <p className="text-xs text-gray-500 mt-1">ID: {subcategory.sub_category_id}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteSubcategory(subcategory.sub_category_id)}
                      disabled={deletingId === subcategory.sub_category_id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete subcategory"
                    >
                      {deletingId === subcategory.sub_category_id ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubCategoryModal;

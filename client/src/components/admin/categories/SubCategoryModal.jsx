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

  // Field Management State
  const [managingFieldsFor, setManagingFieldsFor] = useState(null); // Subcategory object
  const [fields, setFields] = useState([]);
  const [loadingFields, setLoadingFields] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldOptions, setNewFieldOptions] = useState(''); // Comma separated string
  const [addingField, setAddingField] = useState(false);
  const [deletingFieldId, setDeletingFieldId] = useState(null);

  useEffect(() => {
    if (isOpen && category) {
      fetchSubcategories();
      setManagingFieldsFor(null); // Reset view
    }
  }, [isOpen, category]);

  useEffect(() => {
    if (managingFieldsFor) {
      fetchFields(managingFieldsFor.sub_category_id);
    }
  }, [managingFieldsFor]);

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

  const fetchFields = async (subCategoryId) => {
    try {
      setLoadingFields(true);
      const response = await api.get(`/subcategories/${subCategoryId}/fields`);
      if (response.data.success) {
        setFields(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch fields:', err);
      setError('Failed to load variation fields');
    } finally {
      setLoadingFields(false);
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
      const status = err.response?.status;
      const message = err.response?.data?.message || '';

      if (status === 409 || message.toLowerCase().includes('product')) {
        setError('⚠️ Cannot delete this subcategory because it has products associated with it.');
      } else {
        setError(message || 'Failed to delete subcategory.');
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddField = async () => {
    if (!newFieldName.trim() || !newFieldOptions.trim()) {
      setError('Variation Name and Options are required');
      return;
    }

    try {
      setAddingField(true);
      setError('');

      // Parse options from comma-separated string
      const optionsArray = newFieldOptions.split(',').map(opt => opt.trim()).filter(opt => opt);

      const response = await api.post('/admin/category-fields', {
        subCategoryId: managingFieldsFor.sub_category_id,
        fieldName: newFieldName.trim(),
        fieldOptions: optionsArray
      });

      if (response.data.success) {
        setNewFieldName('');
        setNewFieldOptions('');
        fetchFields(managingFieldsFor.sub_category_id);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add variation field');
    } finally {
      setAddingField(false);
    }
  };

  const handleDeleteField = async (fieldId) => {
    if (!window.confirm('Delete this variation option?')) return;

    try {
      setDeletingFieldId(fieldId);
      const response = await api.delete(`/admin/category-fields/${fieldId}`);
      if (response.data.success) {
        fetchFields(managingFieldsFor.sub_category_id);
      }
    } catch (err) {
      setError('Failed to delete field');
    } finally {
      setDeletingFieldId(null);
    }
  };

  const handleClose = () => {
    setNewSubcategoryName('');
    setError('');
    setManagingFieldsFor(null);
    onClose();
  };

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {managingFieldsFor ? `Manage Variations: ${managingFieldsFor.sub_category_name}` : 'Manage Subcategories'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">Category: {category.name}</p>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-50 border-red-300 text-red-800 px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError('')}><X className="w-4 h-4" /></button>
            </div>
          )}

          {!managingFieldsFor ? (
            /* Subcategory List View */
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Add New Subcategory</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubcategoryName}
                    onChange={(e) => setNewSubcategoryName(e.target.value)}
                    placeholder="Enter subcategory name"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={handleAddSubcategory}
                    disabled={adding || !newSubcategoryName.trim()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                  >
                    {adding ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Existing Subcategories ({subcategories.length})</h3>
                {loading ? (
                  <div className="flex justify-center py-4"><Loader className="w-6 h-6 animate-spin text-green-600" /></div>
                ) : (
                  <div className="space-y-2">
                    {subcategories.map((sub) => (
                      <div key={sub.sub_category_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:border-green-300">
                        <div>
                          <p className="font-medium text-gray-900">{sub.sub_category_name}</p>
                          <p className="text-xs text-gray-500">ID: {sub.sub_category_id}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setManagingFieldsFor(sub)}
                            className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                          >
                            Manage Variations
                          </button>
                          <button
                            onClick={() => handleDeleteSubcategory(sub.sub_category_id)}
                            disabled={deletingId === sub.sub_category_id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            {deletingId === sub.sub_category_id ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Fields Management View */
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Variation (e.g. Size, Color)</label>
                <div className="grid gap-3">
                  <input
                    type="text"
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    placeholder="Variation Name (e.g. Size)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    value={newFieldOptions}
                    onChange={(e) => setNewFieldOptions(e.target.value)}
                    placeholder="Options (comma separated, e.g. S, M, L, XL)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={handleAddField}
                    disabled={addingField || !newFieldName.trim() || !newFieldOptions.trim()}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex justify-center items-center gap-2"
                  >
                    {addingField ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    <span>Add Variation</span>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Active Variations</h3>
                {loadingFields ? (
                  <div className="flex justify-center py-4"><Loader className="w-6 h-6 animate-spin text-blue-600" /></div>
                ) : fields.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No variations configured yet.</p>
                ) : (
                  <div className="space-y-3">
                    {fields.map(field => (
                      <div key={field.field_id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-900">{field.field_name}</h4>
                          <button
                            onClick={() => handleDeleteField(field.field_id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {field.field_options && field.field_options.map((opt, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-300">
                              {opt}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 gap-3">
          {managingFieldsFor && (
            <button
              onClick={() => { setManagingFieldsFor(null); setError(''); }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Back to Subcategories
            </button>
          )}
          <button onClick={handleClose} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubCategoryModal;

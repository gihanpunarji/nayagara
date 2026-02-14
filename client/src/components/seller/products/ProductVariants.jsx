import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, AlertCircle, Check, RefreshCw } from 'lucide-react';
import api from '../../../api/axios';

const ProductVariants = ({ variants = [], setVariants, onRemove, errors = {}, subCategoryId }) => {
    // Dynamic Fields State
    const [availableAttributes, setAvailableAttributes] = useState([]);
    const [loadingAttributes, setLoadingAttributes] = useState(false);

    // Form State for Batch Generation
    const [showAddForm, setShowAddForm] = useState(false);
    const [batchForm, setBatchForm] = useState({
        selections: {}, // { "Size": ["S", "M"], "Color": ["Red"] }
        price: '',
        stock_quantity: '',
        sku: ''
    });

    // Custom value input state
    const [customValues, setCustomValues] = useState({}); // { "Color": "Neon Green" }

    // Fetch dynamic category fields
    useEffect(() => {
        if (subCategoryId) {
            fetchFields();
        } else {
            setAvailableAttributes([]);
        }
    }, [subCategoryId]);

    const fetchFields = async () => {
        try {
            setLoadingAttributes(true);
            const response = await api.get(`/subcategories/${subCategoryId}/fields`);
            if (response.data.success) {
                // Filter only fields that are likely variations (or use all)
                // For now, we use all fields configured for the subcategory
                setAvailableAttributes(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching category fields:", error);
        } finally {
            setLoadingAttributes(false);
        }
    };

    const handleSelectionChange = (fieldName, value) => {
        setBatchForm(prev => {
            const currentSelections = prev.selections[fieldName] || [];
            let newSelections;

            if (currentSelections.includes(value)) {
                newSelections = currentSelections.filter(v => v !== value);
            } else {
                newSelections = [...currentSelections, value];
            }

            return {
                ...prev,
                selections: {
                    ...prev.selections,
                    [fieldName]: newSelections
                }
            };
        });
    };

    const handleAddCustomValue = (fieldName) => {
        const value = customValues[fieldName]?.trim();
        if (value) {
            handleSelectionChange(fieldName, value);
            setCustomValues(prev => ({ ...prev, [fieldName]: '' }));
        }
    };

    // Cartesian product generator
    const generateCombinations = (attributesObj) => {
        const keys = Object.keys(attributesObj);
        if (keys.length === 0) return [];

        const result = [];
        const helper = (index, current) => {
            if (index === keys.length) {
                result.push(current);
                return;
            }
            const key = keys[index];
            const values = attributesObj[key];

            if (values.length === 0) {
                // If an attribute has no selected values, treat it as "Any/None" or skip?
                // If they didn't select any option for an attribute, we just don't include it in combination logic
                // effectively skipping it.
                helper(index + 1, current);
            } else {
                for (const val of values) {
                    helper(index + 1, { ...current, [key]: val });
                }
            }
        };

        helper(0, {});
        return result;
    };

    const handleBatchAdd = () => {
        if (!batchForm.price || !batchForm.stock_quantity) {
            alert("Price and Stock are required.");
            return;
        }

        // Filter out empty selections
        const activeSelections = {};
        Object.entries(batchForm.selections).forEach(([key, values]) => {
            if (values && values.length > 0) {
                activeSelections[key] = values;
            }
        });

        if (Object.keys(activeSelections).length === 0) {
            alert("Please select at least one attribute option.");
            return;
        }

        const combinations = generateCombinations(activeSelections);
        const timestamp = Date.now();
        const newVariants = [];

        if (combinations.length === 0) {
            alert("Could not generate combinations. Please select options.");
            return;
        }

        combinations.forEach((combo, index) => {
            // Check for duplicates
            const exists = variants.some(v => {
                if (v.isDeleted) return false;
                // Compare attributes
                const vAttrs = v.attributes || {};
                const keysA = Object.keys(vAttrs);
                const keysB = Object.keys(combo);

                if (keysA.length !== keysB.length) return false;

                return keysA.every(key => vAttrs[key] === combo[key]);
            });

            if (!exists) {
                // Generate SKU if base provided
                let generatedSku = batchForm.sku;
                if (generatedSku) {
                    const suffix = Object.values(combo).join('-');
                    generatedSku = `${generatedSku}-${suffix}`;
                }

                newVariants.push({
                    attributes: combo,
                    price: parseFloat(batchForm.price),
                    stock_quantity: parseInt(batchForm.stock_quantity),
                    sku: generatedSku,
                    tempId: `${timestamp}-${index}`
                });
            }
        });

        if (newVariants.length === 0) {
            alert("No new variants created (duplicates might exist).");
            return;
        }

        setVariants([...variants, ...newVariants]);

        // Reset selections but keep price/stock
        setBatchForm(prev => ({
            ...prev,
            selections: {},
            // keep price/stock/sku base
        }));
    };

    // Helper to get all unique attribute keys from current variants
    const getAllVariantKeys = () => {
        const keys = new Set();
        variants.forEach(v => {
            if (v.attributes) {
                Object.keys(v.attributes).forEach(k => keys.add(k));
            }
        });
        return Array.from(keys);
    };

    const variantKeys = getAllVariantKeys();

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Product Variations</h2>
                    <p className="text-sm text-gray-500">
                        {subCategoryId
                            ? "Create variations based on sub-category attributes."
                            : "Select a sub-category first to add variations."}
                    </p>
                </div>
                {subCategoryId && !showAddForm && (
                    <button
                        type="button"
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Variants</span>
                    </button>
                )}
            </div>

            {showAddForm && (
                <div className="bg-gray-50 p-6 rounded-xl mb-6 border border-gray-200 shadow-inner">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-800">Generate Variants</h3>
                        <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {loadingAttributes ? (
                        <div className="flex justify-center py-8">
                            <RefreshCw className="w-6 h-6 animate-spin text-primary-600" />
                        </div>
                    ) : availableAttributes.length === 0 ? (
                        <div className="text-center py-6 text-gray-500">
                            No variation attributes found for this sub-category.
                            <br /><span className="text-xs">Contact admin to configure attributes like Size, Color, etc.</span>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Attribute Selections */}
                            <div className="grid grid-cols-1 gap-6">
                                {availableAttributes.map(field => (
                                    <div key={field.field_id} className="space-y-2 pb-4 border-b border-gray-200 last:border-0">
                                        <label className="block text-sm font-medium text-gray-900">{field.field_name}</label>

                                        <div className="flex flex-wrap gap-2">
                                            {/* Predefined Options */}
                                            {field.field_options && field.field_options.map((option, idx) => {
                                                const isSelected = batchForm.selections[field.field_name]?.includes(option);
                                                return (
                                                    <button
                                                        key={`${field.field_id}-opt-${idx}`}
                                                        type="button"
                                                        onClick={() => handleSelectionChange(field.field_name, option)}
                                                        className={`
                                                            px-3 py-1.5 text-sm rounded-full border transition-all
                                                            ${isSelected
                                                                ? 'bg-primary-50 border-primary-500 text-primary-700 ring-1 ring-primary-500'
                                                                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                                                            }
                                                        `}
                                                    >
                                                        {option}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Custom Value Input */}
                                        <div className="flex items-center space-x-2 max-w-xs mt-2">
                                            <input
                                                type="text"
                                                value={customValues[field.field_name] || ''}
                                                onChange={(e) => setCustomValues(prev => ({ ...prev, [field.field_name]: e.target.value }))}
                                                placeholder={`Add custom ${field.field_name}...`}
                                                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomValue(field.field_name))}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleAddCustomValue(field.field_name)}
                                                className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Price & Stock Inputs */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-200">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Price (Rs.) <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={batchForm.price}
                                        onChange={(e) => setBatchForm(prev => ({ ...prev, price: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Stock <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={batchForm.stock_quantity}
                                        onChange={(e) => setBatchForm(prev => ({ ...prev, stock_quantity: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">SKU Base <span className="text-gray-400 font-normal">(Optional)</span></label>
                                    <input
                                        type="text"
                                        value={batchForm.sku}
                                        onChange={(e) => setBatchForm(prev => ({ ...prev, sku: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="e.g. TSHIRT-001"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="px-4 py-2 mr-3 text-sm font-medium text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleBatchAdd}
                                    className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 shadow-sm flex items-center"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Generate Variants
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Variants List */}
            {variants.length > 0 ? (
                <div className="overflow-hidden border border-gray-200 rounded-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse bg-white">
                            <thead className="bg-gray-50">
                                <tr>
                                    {/* Dynamic Headers */}
                                    {variantKeys.map(key => (
                                        <th key={key} className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            {key}
                                        </th>
                                    ))}
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price (Rs.)</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {variants.map((v, idx) => (
                                    <tr key={v.variant_id || v.tempId || idx} className="hover:bg-gray-50 transition-colors">
                                        {/* Dynamic Cells */}
                                        {variantKeys.map(key => (
                                            <td key={key} className="py-3 px-4 text-sm text-gray-900">
                                                {v.attributes?.[key] || '-'}
                                            </td>
                                        ))}
                                        <td className="py-3 px-4">
                                            <input
                                                type="number"
                                                value={v.price}
                                                onChange={(e) => {
                                                    const newVariants = [...variants];
                                                    newVariants[idx] = { ...newVariants[idx], price: e.target.value };
                                                    setVariants(newVariants);
                                                }}
                                                className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
                                                min="0"
                                                step="0.01"
                                            />
                                        </td>
                                        <td className="py-3 px-4">
                                            <input
                                                type="number"
                                                value={v.stock_quantity}
                                                onChange={(e) => {
                                                    const newVariants = [...variants];
                                                    newVariants[idx] = { ...newVariants[idx], stock_quantity: e.target.value };
                                                    setVariants(newVariants);
                                                }}
                                                className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500"
                                                min="0"
                                            />
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-500">
                                            {v.sku || '-'}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (onRemove) {
                                                        onRemove(idx);
                                                    } else {
                                                        const newMethods = [...variants];
                                                        newMethods.splice(idx, 1);
                                                        setVariants(newMethods);
                                                    }
                                                }}
                                                className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <Plus className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900">No variations added</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {subCategoryId
                            ? "Click 'Add Variants' to generate combinations."
                            : "Select a Category and Sub-category above to start."}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProductVariants;

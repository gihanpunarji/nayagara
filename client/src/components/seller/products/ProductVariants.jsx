import React, { useState, useEffect } from 'react'; // Added useEffect
import { Plus, Trash2, X, AlertCircle, Check } from 'lucide-react';
import api from '../../../api/axios'; // Added api import

const ProductVariants = ({ variants = [], setVariants, onRemove, errors = {}, subCategoryId }) => { // Added subCategoryId
    // Mode: 'single' or 'batch' (though we can just make the form smart)
    const [attributeKeys, setAttributeKeys] = useState({
        primary: 'Size',
        secondary: 'Color'
    });

    const [batchForm, setBatchForm] = useState({
        size: '',
        colors: [], // Array of selected colors
        price: '',
        stock_quantity: '',
        sku: ''
    });

    const [showAddForm, setShowAddForm] = useState(false);
    const [customColor, setCustomColor] = useState('');
    const [dynamicSizes, setDynamicSizes] = useState(null); // State for dynamic sizes

    // Predefined lists
    const defaultSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'Free Size'];
    const [sizes, setSizes] = useState(defaultSizes); // Use state for sizes

    // Fetch dynamic category fields
    useEffect(() => {
        if (subCategoryId) {
            const fetchFields = async () => {
                try {
                    const response = await api.get(`/subcategories/${subCategoryId}/fields`);
                    if (response.data.success && response.data.data.length > 0) {
                        const fields = response.data.data;

                        // Look for a field that looks like a "Size" or "Primary Variation"
                        // For now, we take the first field or specifically "Size"
                        const sizeField = fields.find(f =>
                            ['size', 'capacity', 'volume', 'dimension', 'weight'].includes(f.field_name.toLowerCase())
                        ) || fields[0]; // Fallback to first field if strictly size not found

                        // Only override if options exist
                        if (sizeField && sizeField.field_options && sizeField.field_options.length > 0) {
                            setSizes(sizeField.field_options);
                            setAttributeKeys(prev => ({ ...prev, primary: sizeField.field_name }));
                        } else {
                            setSizes(defaultSizes);
                            setAttributeKeys(prev => ({ ...prev, primary: 'Size' }));
                        }
                    } else {
                        setSizes(defaultSizes);
                        setAttributeKeys(prev => ({ ...prev, primary: 'Size' }));
                    }
                } catch (error) {
                    console.error("Error fetching category fields:", error);
                }
            };
            fetchFields();
        }
    }, [subCategoryId]);

    // Common web colors with hex for display
    const predefinedColors = [
        { name: 'Red', hex: '#FF0000' },
        { name: 'Blue', hex: '#0000FF' },
        { name: 'Green', hex: '#008000' },
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#FFFFFF', border: true },
        { name: 'Yellow', hex: '#FFFF00' },
        { name: 'Purple', hex: '#800080' },
        { name: 'Orange', hex: '#FFA500' },
        { name: 'Pink', hex: '#FFC0CB' },
        { name: 'Grey', hex: '#808080' },
        { name: 'Brown', hex: '#A52A2A' },
        { name: 'Beige', hex: '#F5F5DC' },
        { name: 'Multicolor', hex: 'linear-gradient(to right, red, blue, green)' }
    ];

    const toggleColor = (colorName) => {
        if (batchForm.colors.includes(colorName)) {
            setBatchForm(prev => ({ ...prev, colors: prev.colors.filter(c => c !== colorName) }));
        } else {
            setBatchForm(prev => ({ ...prev, colors: [...prev.colors, colorName] }));
        }
    };

    const handleAddCustomColor = () => {
        if (customColor && !batchForm.colors.includes(customColor)) {
            setBatchForm(prev => ({ ...prev, colors: [...prev.colors, customColor] }));
            setCustomColor('');
        }
    };

    const handleBatchAdd = () => {
        if (!batchForm.price || !batchForm.stock_quantity) {
            alert("Price and Stock are required.");
            return;
        }

        if (!batchForm.size && batchForm.colors.length === 0) {
            alert("Please select at least a Size or some Colors.");
            return;
        }

        const newVariants = [];
        const timestamp = Date.now();

        // If defined colors, create one variant per color
        if (batchForm.colors.length > 0) {
            batchForm.colors.forEach((color, index) => {
                // Check duplicate
                const exists = variants.some(v =>
                    v.attributes?.[attributeKeys.primary] === batchForm.size &&
                    v.attributes?.[attributeKeys.secondary] === color &&
                    !v.isDeleted
                );

                if (!exists) {
                    newVariants.push({
                        attributes: {
                            [attributeKeys.primary]: batchForm.size,
                            [attributeKeys.secondary]: color
                        },
                        price: parseFloat(batchForm.price),
                        stock_quantity: parseInt(batchForm.stock_quantity),
                        sku: batchForm.sku ? `${batchForm.sku}-${batchForm.size}-${color}` : '',
                        tempId: `${timestamp}-${index}`
                    });
                }
            });
        } else {
            // Just size, no color
            const exists = variants.some(v =>
                v.attributes?.[attributeKeys.primary] === batchForm.size &&
                (!v.attributes?.[attributeKeys.secondary]) &&
                !v.isDeleted
            );

            if (!exists) {
                newVariants.push({
                    attributes: {
                        [attributeKeys.primary]: batchForm.size,
                        [attributeKeys.secondary]: ''
                    },
                    price: parseFloat(batchForm.price),
                    stock_quantity: parseInt(batchForm.stock_quantity),
                    sku: batchForm.sku ? `${batchForm.sku}-${batchForm.size}` : '',
                    tempId: `${timestamp}-0`
                });
            }
        }

        if (newVariants.length === 0) {
            alert("No new variants created (duplicates might exist).");
            return;
        }

        setVariants([...variants, ...newVariants]);

        // Reset necessary fields but keep price/stock for convenience? 
        // User might want to add another size with same price.
        setBatchForm(prev => ({
            ...prev,
            size: '',
            colors: [], // Clear colors
            // Keep price/stock/sku base
        }));
        // Don't close form, allows rapid entry
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Product Variations</h2>
                    <p className="text-sm text-gray-500">Create variations by combining Size with multiple Colors.</p>
                </div>
                {!showAddForm && (
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
                        <h3 className="font-semibold text-gray-800">Add New Variations</h3>
                        <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Row 1: Size & Price & Stock */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Size */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">{attributeKeys.primary}</label>
                                <select
                                    value={batchForm.size}
                                    onChange={(e) => setBatchForm(prev => ({ ...prev, size: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="">Select {attributeKeys.primary}</option>
                                    {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            {/* Price */}
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

                            {/* Stock */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Stock Quantity <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    min="0"
                                    value={batchForm.stock_quantity}
                                    onChange={(e) => setBatchForm(prev => ({ ...prev, stock_quantity: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        {/* Row 2: Colors Multi-Select */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Available {attributeKeys.secondary}s for this {attributeKeys.primary}</label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {predefinedColors.map(c => {
                                    const isSelected = batchForm.colors.includes(c.name);
                                    return (
                                        <button
                                            key={c.name}
                                            type="button"
                                            onClick={() => toggleColor(c.name)}
                                            className={`
                                                flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all
                                                ${isSelected
                                                    ? 'border-primary-600 bg-primary-50 text-primary-700 ring-2 ring-primary-100 ring-offset-1'
                                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                                }
                                            `}
                                        >
                                            <span
                                                className={`w-3 h-3 rounded-full border ${c.border ? 'border-gray-200' : 'border-transparent'}`}
                                                style={{ background: c.hex }}
                                            ></span>
                                            <span className="text-sm font-medium">{c.name}</span>
                                            {isSelected && <Check className="w-3 h-3 ml-1" />}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Custom Color Input */}
                            <div className="flex items-center space-x-2 max-w-xs">
                                <input
                                    type="text"
                                    value={customColor}
                                    onChange={(e) => setCustomColor(e.target.value)}
                                    placeholder="Add custom color..."
                                    className="flex-1 text-sm border-gray-300 rounded-lg"
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomColor())}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddCustomColor}
                                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="px-4 py-2 mr-3 text-sm font-medium text-gray-600 hover:text-gray-800"
                            >
                                Done
                            </button>
                            <button
                                type="button"
                                onClick={handleBatchAdd}
                                className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 shadow-sm flex items-center"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add {batchForm.colors.length > 0 ? `${batchForm.colors.length} Variants` : 'Variant'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Variants List */}
            {variants.length > 0 ? (
                <div className="overflow-hidden border border-gray-200 rounded-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse bg-white">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{attributeKeys.primary}</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{attributeKeys.secondary}</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price (Rs.)</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {variants.map((v, idx) => (
                                    <tr key={v.variant_id || v.tempId || idx} className="hover:bg-gray-50 transition-colors group">
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{v.attributes?.[attributeKeys.primary] || '-'}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700">
                                            {v.attributes?.[attributeKeys.secondary] ? (
                                                <div className="flex items-center space-x-2">
                                                    <span
                                                        className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
                                                        style={{
                                                            backgroundColor: predefinedColors.find(c => c.name === v.attributes[attributeKeys.secondary])?.hex || v.attributes[attributeKeys.secondary],
                                                            background: v.attributes[attributeKeys.secondary] === 'Multicolor' ? 'linear-gradient(to right, red, blue, green)' : undefined
                                                        }}
                                                    ></span>
                                                    <span>{v.attributes[attributeKeys.secondary]}</span>
                                                </div>
                                            ) : '-'}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-700">
                                            {parseFloat(v.price).toLocaleString()}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-700">
                                            {v.stock_quantity}
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
                    <p className="mt-1 text-sm text-gray-500">Combine sizes and colors to track inventory.</p>
                </div>
            )}
        </div>
    );
};

export default ProductVariants;

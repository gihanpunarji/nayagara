import React, { useState } from 'react';
import { Plus, Trash2, X, AlertCircle } from 'lucide-react';

const ProductVariants = ({ variants = [], setVariants, onRemove, errors = {} }) => {
    const [newVariant, setNewVariant] = useState({
        attributes: {
            Size: '',
            Color: ''
        },
        price: '',
        stock_quantity: '',
        sku: ''
    });

    const [showAddForm, setShowAddForm] = useState(false);

    // Common sizes and colors (could be fetched or dynamic in future)
    const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'Free Size'];
    const colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Purple', 'Orange', 'Pink', 'Grey', 'Brown', 'Beige', 'Multicolor'];

    const handleAddVariant = () => {
        if (!newVariant.price || !newVariant.stock_quantity) {
            alert("Price and Stock are required for a variation.");
            return;
        }

        if (!newVariant.attributes.Size && !newVariant.attributes.Color) {
            alert("At least one attribute (Size or Color) is required.");
            return;
        }

        // Check availability
        const alreadyExists = variants.some(v =>
            (v.attributes?.Size === newVariant.attributes.Size) &&
            (v.attributes?.Color === newVariant.attributes.Color) &&
            !v.isDeleted
        );

        if (alreadyExists) {
            alert("This variation already exists.");
            return;
        }

        const variantToAdd = {
            ...newVariant,
            // Ensure numbers
            price: parseFloat(newVariant.price),
            stock_quantity: parseInt(newVariant.stock_quantity),
            // Temp ID for key
            tempId: Date.now()
        };

        setVariants([...variants, variantToAdd]);

        // Reset form
        setNewVariant({
            attributes: {
                Size: '',
                Color: ''
            },
            price: '',
            stock_quantity: '',
            sku: ''
        });
        setShowAddForm(false);
    };

    const removeVariant = (index) => {
        const updated = [...variants];
        const variant = updated[index];

        if (variant.variant_id) {
            // If it has a real ID (from DB), mark as deleted
            // We'll filter these out in display, but keep them in state to send to backend as 'deletedVariantIds' if needed
            // Actually, it's easier to maintain a separate 'deleted' list in parent, 
            // or just mark 'isDeleted' flag here and filter in UI.
            // Let's assume parent handles deletion logic if we pass modified array.
            // Wait, best practice: separate 'deletedVariantIds' in parent.
            // Or helper: just remove from list if new, add to "deleted" list if existing.
            // For now, I'll just remove from this list, and let parent compare or handle "deletedVariantIds".
            // Actually, ProductForm needs to know what to delete.
            // I will add an `onRemove` prop to handle this logic cleanly.
        }

        // Parent handles removal logic via setVariants usually?
        // Let's just pass index to parent if possible, but here we have setVariants.
        // If I just remove it from array, parent state updates.
        // If it was an existing variant, we accept that it's gone from the "active" list.
        // The parent needs to track what was removed.

        // NOTE: This component might need to be smarter or receive a 'removeVariant' function prop.
        // For MVP, I'll assume setVariants updates the list, and I'll handle "deleted" tracking in parent 
        // by comparing with initial data, OR I ask for an onRemove callback.
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Product Variations</h2>
                    <p className="text-sm text-gray-500">Add different options like sizes and colors with their own prices.</p>
                </div>
                {!showAddForm && (
                    <button
                        type="button"
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Variant</span>
                    </button>
                )}
            </div>

            {showAddForm && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {/* Size */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Size</label>
                            <select
                                value={newVariant.attributes.Size}
                                onChange={(e) => setNewVariant({ ...newVariant, attributes: { ...newVariant.attributes, Size: e.target.value } })}
                                className="w-full text-sm border-gray-300 rounded-lg"
                            >
                                <option value="">Select Size</option>
                                {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        {/* Color */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                            <div className="relative">
                                <input
                                    list="colors-list"
                                    type="text"
                                    placeholder="Select or Type Color"
                                    value={newVariant.attributes.Color}
                                    onChange={(e) => setNewVariant({ ...newVariant, attributes: { ...newVariant.attributes, Color: e.target.value } })}
                                    className="w-full text-sm border-gray-300 rounded-lg"
                                />
                                <datalist id="colors-list">
                                    {colors.map(c => <option key={c} value={c} />)}
                                </datalist>
                            </div>
                        </div>
                        {/* Price */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Price (Rs.) *</label>
                            <input
                                type="number"
                                min="0"
                                value={newVariant.price}
                                onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
                                className="w-full text-sm border-gray-300 rounded-lg"
                                placeholder="0.00"
                            />
                        </div>
                        {/* Stock */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Stock *</label>
                            <input
                                type="number"
                                min="0"
                                value={newVariant.stock_quantity}
                                onChange={(e) => setNewVariant({ ...newVariant, stock_quantity: e.target.value })}
                                className="w-full text-sm border-gray-300 rounded-lg"
                                placeholder="0"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setShowAddForm(false)}
                            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleAddVariant}
                            className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                        >
                            Save Variant
                        </button>
                    </div>
                </div>
            )}

            {/* Variants List */}
            {variants.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="py-3 px-2 text-xs font-medium text-gray-500 uppercase">Size</th>
                                <th className="py-3 px-2 text-xs font-medium text-gray-500 uppercase">Color</th>
                                <th className="py-3 px-2 text-xs font-medium text-gray-500 uppercase">Price</th>
                                <th className="py-3 px-2 text-xs font-medium text-gray-500 uppercase">Stock</th>
                                <th className="py-3 px-2 text-xs font-medium text-gray-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {variants.map((v, idx) => (
                                <tr key={v.variant_id || v.tempId || idx} className="group hover:bg-gray-50 border-b border-gray-50 last:border-0">
                                    <td className="py-3 px-2 text-sm text-gray-900">{v.attributes?.Size || '-'}</td>
                                    <td className="py-3 px-2 text-sm text-gray-900">
                                        {v.attributes?.Color ? (
                                            <span className="flex items-center">
                                                <span className="w-3 h-3 rounded-full mr-2 border border-gray-200" style={{ backgroundColor: v.attributes.Color }}></span>
                                                {v.attributes.Color}
                                            </span>
                                        ) : '-'}
                                    </td>
                                    <td className="py-3 px-2 text-sm text-gray-900">Rs. {parseFloat(v.price).toLocaleString()}</td>
                                    <td className="py-3 px-2 text-sm text-gray-900">{v.stock_quantity}</td>
                                    <td className="py-3 px-2 text-right">
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
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <p>No variations added yet.</p>
                    <button onClick={() => setShowAddForm(true)} className="text-primary-600 text-sm mt-1 hover:underline">Add one now</button>
                </div>
            )}
        </div>
    );
};

export default ProductVariants;

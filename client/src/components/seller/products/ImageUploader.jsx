import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, GripVertical, Star, Eye } from 'lucide-react';

const ImageUploader = ({ images = [], onUpdate, maxImages = 10, error }) => {
  const fileInputRef = useRef(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedOver, setDraggedOver] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Handle file selection
  const handleFileSelect = useCallback((files) => {
    const newImages = [];
    const remainingSlots = maxImages - images.length;

    Array.from(files).slice(0, remainingSlots).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = {
            id: Date.now() + Math.random(),
            file,
            url: e.target.result,
            name: file.name,
            size: file.size
          };
          newImages.push(imageData);

          if (newImages.length === Math.min(files.length, remainingSlots)) {
            onUpdate([...images, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }, [images, maxImages, onUpdate]);

  // Handle file input change
  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileSelect(files);
      // Reset input
      e.target.value = '';
    }
  };

  // Handle drag and drop for file upload
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle image removal
  const removeImage = (imageId) => {
    onUpdate(images.filter(img => img.id !== imageId));
  };

  // Handle drag and drop for reordering
  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    setDraggedOver(index);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    // Only clear draggedOver if we're leaving the entire item
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDraggedOver(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDraggedOver(null);
  };

  const handleDropReorder = (e, dropIndex) => {
    e.preventDefault();

    if (draggedItem !== null && draggedItem !== dropIndex) {
      const newImages = [...images];
      const draggedImage = newImages[draggedItem];

      // Remove from original position
      newImages.splice(draggedItem, 1);

      // Insert at new position
      if (dropIndex > draggedItem) {
        newImages.splice(dropIndex - 1, 0, draggedImage);
      } else {
        newImages.splice(dropIndex, 0, draggedImage);
      }

      onUpdate(newImages);
    }

    setDraggedItem(null);
    setDraggedOver(null);
  };

  // Set as main image (move to first position)
  const setAsMainImage = (index) => {
    if (index === 0) return;

    const newImages = [...images];
    const mainImage = newImages.splice(index, 1)[0];
    newImages.unshift(mainImage);
    onUpdate(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-primary-400 bg-gray-50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="space-y-4">
            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
              error ? 'bg-red-100' : 'bg-primary-100'
            }`}>
              <Upload className={`w-6 h-6 ${error ? 'text-red-600' : 'text-primary-600'}`} />
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Upload Product Images
              </h3>
              <p className="text-gray-600 mb-4">
                Drag and drop images here, or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Supports: JPG, PNG, WEBP • Max size: 5MB each • {images.length}/{maxImages} images
              </p>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Choose Images</span>
            </button>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">
              Product Images ({images.length}/{maxImages})
            </h4>
            <p className="text-xs text-gray-500">
              Drag to reorder • First image is main image
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropReorder(e, index)}
                onDragEnd={handleDragEnd}
                className={`relative group rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-move ${
                  draggedOver === index ? 'border-primary-400 shadow-lg' : 'border-gray-200'
                } ${draggedItem === index ? 'opacity-50 scale-95' : ''}`}
              >
                {/* Main Image Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 z-10">
                    <span className="flex items-center space-x-1 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                      <Star className="w-3 h-3" />
                      <span>Main</span>
                    </span>
                  </div>
                )}

                {/* Image */}
                <div className="aspect-square bg-gray-100 relative">
                  <img
                    src={image.url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                      {/* Preview Button */}
                      <button
                        type="button"
                        onClick={() => setPreviewImage(image)}
                        className="p-2 bg-white bg-opacity-90 text-gray-700 rounded-full hover:bg-opacity-100 transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Set as Main Button */}
                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() => setAsMainImage(index)}
                          className="p-2 bg-white bg-opacity-90 text-gray-700 rounded-full hover:bg-opacity-100 transition-all"
                          title="Set as main image"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      )}

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="p-2 bg-white bg-opacity-90 text-red-600 rounded-full hover:bg-opacity-100 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Drag Handle */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-5 h-5 text-white drop-shadow-lg" />
                  </div>
                </div>

                {/* Image Info */}
                <div className="p-2 bg-white">
                  <p className="text-xs text-gray-600 truncate">{image.name}</p>
                  <p className="text-xs text-gray-500">
                    {(image.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={previewImage.url}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />

            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4 rounded-b-lg">
              <p className="font-medium">{previewImage.name}</p>
              <p className="text-sm text-gray-300">
                Size: {(previewImage.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
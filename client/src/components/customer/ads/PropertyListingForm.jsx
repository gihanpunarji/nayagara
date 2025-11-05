import React from 'react';

const PropertyListingForm = ({ subcategory, propertyData, onChange, errors = {} }) => {
  // const handleFieldChange = (field, value) => {
  //   onChange({
  //     ...propertyData,
  //     [field]: value
  //   });
  // };

  // const propertyFields = {
  //   'Houses': [
  //     {
  //       name: 'propertyType',
  //       label: 'House Type',
  //       type: 'select',
  //       options: ['Single Story', 'Two Story', 'Three Story', 'Bungalow', 'Villa', 'Apartment House', 'Other'],
  //       required: true
  //     },
  //     {
  //       name: 'bedrooms',
  //       label: 'Bedrooms',
  //       type: 'select',
  //       options: ['1', '2', '3', '4', '5', '6+'],
  //       required: true
  //     },
  //     {
  //       name: 'bathrooms',
  //       label: 'Bathrooms',
  //       type: 'select',
  //       options: ['1', '2', '3', '4', '5+'],
  //       required: true
  //     },
  //     {
  //       name: 'floorArea',
  //       label: 'Floor Area (sq ft)',
  //       type: 'number',
  //       required: true,
  //       placeholder: 'e.g., 1500'
  //     },
  //     {
  //       name: 'landSize',
  //       label: 'Land Size (perches)',
  //       type: 'number',
  //       required: true,
  //       placeholder: 'e.g., 10'
  //     },
  //     {
  //       name: 'condition',
  //       label: 'Condition',
  //       type: 'select',
  //       options: ['Brand New', 'Excellent', 'Good', 'Fair', 'Needs Renovation'],
  //       required: true
  //     },
  //     {
  //       name: 'parking',
  //       label: 'Parking',
  //       type: 'select',
  //       options: ['No Parking', '1 Car', '2 Cars', '3+ Cars'],
  //       required: false
  //     },
  //     {
  //       name: 'furnished',
  //       label: 'Furnished',
  //       type: 'select',
  //       options: ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'],
  //       required: false
  //     },
  //     {
  //       name: 'address',
  //       label: 'Address',
  //       type: 'textarea',
  //       required: true,
  //       placeholder: 'Enter the full address'
  //     }
  //   ],
  //   'Land': [
  //     {
  //       name: 'landType',
  //       label: 'Land Type',
  //       type: 'select',
  //       options: ['Residential', 'Commercial', 'Agricultural', 'Industrial', 'Mixed Development'],
  //       required: true
  //     },
  //     {
  //       name: 'landSize',
  //       label: 'Land Size (perches)',
  //       type: 'number',
  //       required: true,
  //       placeholder: 'e.g., 20'
  //     },
  //     {
  //       name: 'landSizeAcres',
  //       label: 'Land Size (acres)',
  //       type: 'number',
  //       required: false,
  //       placeholder: 'For larger plots'
  //     },
  //     {
  //       name: 'frontage',
  //       label: 'Frontage (feet)',
  //       type: 'number',
  //       required: false,
  //       placeholder: 'e.g., 60'
  //     },
  //     {
  //       name: 'access',
  //       label: 'Road Access',
  //       type: 'select',
  //       options: ['Main Road', 'Link Road', 'Private Road', 'No Direct Access'],
  //       required: true
  //     },
  //     {
  //       name: 'utilities',
  //       label: 'Utilities Available',
  //       type: 'multiselect',
  //       options: ['Electricity', 'Water', 'Telephone', 'Cable/Internet'],
  //       required: false
  //     },
  //     {
  //       name: 'clearTitle',
  //       label: 'Clear Title',
  //       type: 'select',
  //       options: ['Yes', 'No', 'In Process'],
  //       required: true
  //     },
  //     {
  //       name: 'address',
  //       label: 'Address/Location',
  //       type: 'textarea',
  //       required: true,
  //       placeholder: 'Enter the location details'
  //     }
  //   ],
  //   'Apartments': [
  //     {
  //       name: 'apartmentType',
  //       label: 'Apartment Type',
  //       type: 'select',
  //       options: ['Studio', '1 Bedroom', '2 Bedroom', '3 Bedroom', '4+ Bedroom', 'Penthouse'],
  //       required: true
  //     },
  //     {
  //       name: 'floor',
  //       label: 'Floor',
  //       type: 'number',
  //       required: true,
  //       placeholder: 'e.g., 5'
  //     },
  //     {
  //       name: 'totalFloors',
  //       label: 'Total Floors in Building',
  //       type: 'number',
  //       required: false,
  //       placeholder: 'e.g., 15'
  //     },
  //     {
  //       name: 'floorArea',
  //       label: 'Floor Area (sq ft)',
  //       type: 'number',
  //       required: true,
  //       placeholder: 'e.g., 1200'
  //     },
  //     {
  //       name: 'bedrooms',
  //       label: 'Bedrooms',
  //       type: 'select',
  //       options: ['Studio', '1', '2', '3', '4+'],
  //       required: true
  //     },
  //     {
  //       name: 'bathrooms',
  //       label: 'Bathrooms',
  //       type: 'select',
  //       options: ['1', '2', '3', '4+'],
  //       required: true
  //     },
  //     {
  //       name: 'parking',
  //       label: 'Parking',
  //       type: 'select',
  //       options: ['No Parking', '1 Car', '2 Cars'],
  //       required: false
  //     },
  //     {
  //       name: 'furnished',
  //       label: 'Furnished',
  //       type: 'select',
  //       options: ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'],
  //       required: false
  //     },
  //     {
  //       name: 'amenities',
  //       label: 'Amenities',
  //       type: 'multiselect',
  //       options: ['Swimming Pool', 'Gym', 'Security', 'Elevator', 'Generator', 'Children\'s Play Area'],
  //       required: false
  //     },
  //     {
  //       name: 'address',
  //       label: 'Address',
  //       type: 'textarea',
  //       required: true,
  //       placeholder: 'Enter the full address'
  //     }
  //   ],
  //   'Commercial Property': [
  //     {
  //       name: 'propertyType',
  //       label: 'Property Type',
  //       type: 'select',
  //       options: ['Office Space', 'Retail Shop', 'Warehouse', 'Factory', 'Restaurant Space', 'Hotel', 'Other'],
  //       required: true
  //     },
  //     {
  //       name: 'floorArea',
  //       label: 'Floor Area (sq ft)',
  //       type: 'number',
  //       required: true,
  //       placeholder: 'e.g., 2000'
  //     },
  //     {
  //       name: 'floors',
  //       label: 'Number of Floors',
  //       type: 'number',
  //       required: false,
  //       placeholder: 'e.g., 2'
  //     },
  //     {
  //       name: 'parking',
  //       label: 'Parking Spaces',
  //       type: 'number',
  //       required: false,
  //       placeholder: 'e.g., 10'
  //     },
  //     {
  //       name: 'facilities',
  //       label: 'Facilities',
  //       type: 'multiselect',
  //       options: ['Air Conditioning', 'Elevator', 'Security', 'Generator', 'Fire Safety', 'Loading Bay'],
  //       required: false
  //     },
  //     {
  //       name: 'condition',
  //       label: 'Condition',
  //       type: 'select',
  //       options: ['Brand New', 'Excellent', 'Good', 'Fair', 'Needs Renovation'],
  //       required: true
  //     },
  //     {
  //       name: 'address',
  //       label: 'Address',
  //       type: 'textarea',
  //       required: true,
  //       placeholder: 'Enter the full address'
  //     }
  //   ],
  //   'Rooms': [
  //     {
  //       name: 'roomType',
  //       label: 'Room Type',
  //       type: 'select',
  //       options: ['Single Room', 'Double Room', 'Shared Room', 'Studio', 'Boarding'],
  //       required: true
  //     },
  //     {
  //       name: 'attachedBathroom',
  //       label: 'Attached Bathroom',
  //       type: 'select',
  //       options: ['Yes', 'No', 'Shared'],
  //       required: true
  //     },
  //     {
  //       name: 'furnished',
  //       label: 'Furnished',
  //       type: 'select',
  //       options: ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'],
  //       required: true
  //     },
  //     {
  //       name: 'facilities',
  //       label: 'Facilities Included',
  //       type: 'multiselect',
  //       options: ['WiFi', 'Meals', 'Laundry', 'Parking', 'Security', 'Kitchen Access'],
  //       required: false
  //     },
  //     {
  //       name: 'gender',
  //       label: 'Preferred Gender',
  //       type: 'select',
  //       options: ['Any', 'Male Only', 'Female Only'],
  //       required: false
  //     },
  //     {
  //       name: 'address',
  //       label: 'Address',
  //       type: 'textarea',
  //       required: true,
  //       placeholder: 'Enter the full address'
  //     }
  //   ]
  // };

  // const fields = propertyFields[subcategory] || [];

  // if (fields.length === 0) {
  //   return null;
  // }

  // return (
  //   <div className="space-y-6">
  //     <div>
  //       <h3 className="text-lg font-semibold text-gray-900 mb-4">
  //         {subcategory} Details
  //       </h3>
  //       <p className="text-gray-600 text-sm mb-6">
  //         Provide specific details about your {subcategory.toLowerCase()}
  //       </p>
  //     </div>

  //     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //       {fields.map(field => (
  //         <div key={field.name} className={`space-y-2 ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}>
  //           <label className="block text-sm font-medium text-gray-700">
  //             {field.label}
  //             {field.required && <span className="text-red-500 ml-1">*</span>}
  //           </label>

  //           {field.type === 'select' ? (
  //             <select
  //               value={propertyData[field.name] || ''}
  //               onChange={(e) => handleFieldChange(field.name, e.target.value)}
  //               className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
  //                 errors[field.name] ? 'border-red-500' : 'border-gray-300'
  //               }`}
  //             >
  //               <option value="">Select {field.label}</option>
  //               {field.options.map(option => (
  //                 <option key={option} value={option}>{option}</option>
  //               ))}
  //             </select>
  //           ) : field.type === 'multiselect' ? (
  //             <div className="space-y-2">
  //               {field.options.map(option => (
  //                 <label key={option} className="flex items-center space-x-2">
  //                   <input
  //                     type="checkbox"
  //                     checked={(propertyData[field.name] || []).includes(option)}
  //                     onChange={(e) => {
  //                       const currentValues = propertyData[field.name] || [];
  //                       if (e.target.checked) {
  //                         handleFieldChange(field.name, [...currentValues, option]);
  //                       } else {
  //                         handleFieldChange(field.name, currentValues.filter(v => v !== option));
  //                       }
  //                     }}
  //                     className="w-4 h-4 text-blue-600 border-gray-300 rounded"
  //                   />
  //                   <span className="text-sm text-gray-700">{option}</span>
  //                 </label>
  //               ))}
  //             </div>
  //           ) : field.type === 'textarea' ? (
  //             <textarea
  //               value={propertyData[field.name] || ''}
  //               onChange={(e) => handleFieldChange(field.name, e.target.value)}
  //               rows={3}
  //               className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
  //                 errors[field.name] ? 'border-red-500' : 'border-gray-300'
  //               }`}
  //               placeholder={field.placeholder}
  //             />
  //           ) : (
  //             <input
  //               type={field.type}
  //               value={propertyData[field.name] || ''}
  //               onChange={(e) => handleFieldChange(field.name, e.target.value)}
  //               className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
  //                 errors[field.name] ? 'border-red-500' : 'border-gray-300'
  //               }`}
  //               placeholder={field.placeholder}
  //               {...(field.type === 'number' && { min: 0 })}
  //             />
  //           )}

  //           {errors[field.name] && (
  //             <p className="text-red-500 text-sm">{errors[field.name]}</p>
  //           )}
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );
};

export default PropertyListingForm;
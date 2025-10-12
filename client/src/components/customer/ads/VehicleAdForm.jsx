// import React from 'react';

const VehicleAdForm = ({ subcategory, vehicleData, onChange, errors = {} }) => {
//   const handleFieldChange = (field, value) => {
//     onChange({
//       ...vehicleData,
//       [field]: value
//     });
//   };

//   const vehicleFields = {
//     'Cars': [
//       {
//         name: 'make',
//         label: 'Make',
//         type: 'select',
//         options: ['Toyota', 'Honda', 'Nissan', 'Suzuki', 'Mitsubishi', 'Hyundai', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Ford', 'Mazda', 'Subaru', 'Other'],
//         required: true
//       },
//       {
//         name: 'model',
//         label: 'Model',
//         type: 'text',
//         required: true,
//         placeholder: 'e.g., Corolla, Civic, March'
//       },
//       {
//         name: 'year',
//         label: 'Year of Manufacture',
//         type: 'select',
//         options: Array.from({length: 30}, (_, i) => String(2024 - i)),
//         required: true
//       },
//       {
//         name: 'mileage',
//         label: 'Mileage (km)',
//         type: 'number',
//         required: true,
//         placeholder: 'e.g., 50000'
//       },
//       {
//         name: 'fuelType',
//         label: 'Fuel Type',
//         type: 'select',
//         options: ['Petrol', 'Diesel', 'Hybrid', 'Electric'],
//         required: true
//       },
//       {
//         name: 'transmission',
//         label: 'Transmission',
//         type: 'select',
//         options: ['Manual', 'Automatic', 'CVT'],
//         required: true
//       },
//       {
//         name: 'engineCapacity',
//         label: 'Engine Capacity (cc)',
//         type: 'number',
//         required: false,
//         placeholder: 'e.g., 1500'
//       },
//       {
//         name: 'color',
//         label: 'Color',
//         type: 'text',
//         required: false,
//         placeholder: 'e.g., White, Black, Red'
//       },
//       {
//         name: 'condition',
//         label: 'Condition',
//         type: 'select',
//         options: ['Brand New', 'Used - Excellent', 'Used - Good', 'Used - Fair'],
//         required: true
//       }
//     ],
//     'Motorcycles': [
//       {
//         name: 'make',
//         label: 'Make',
//         type: 'select',
//         options: ['Honda', 'Yamaha', 'Suzuki', 'Bajaj', 'TVS', 'Royal Enfield', 'Hero', 'KTM', 'Kawasaki', 'Other'],
//         required: true
//       },
//       {
//         name: 'model',
//         label: 'Model',
//         type: 'text',
//         required: true,
//         placeholder: 'e.g., CB 150, FZ, Pulsar'
//       },
//       {
//         name: 'year',
//         label: 'Year of Manufacture',
//         type: 'select',
//         options: Array.from({length: 25}, (_, i) => String(2024 - i)),
//         required: true
//       },
//       {
//         name: 'mileage',
//         label: 'Mileage (km)',
//         type: 'number',
//         required: true,
//         placeholder: 'e.g., 15000'
//       },
//       {
//         name: 'engineCapacity',
//         label: 'Engine Capacity (cc)',
//         type: 'select',
//         options: ['100cc', '125cc', '150cc', '200cc', '250cc', '300cc+'],
//         required: true
//       },
//       {
//         name: 'color',
//         label: 'Color',
//         type: 'text',
//         required: false,
//         placeholder: 'e.g., Black, Red, Blue'
//       },
//       {
//         name: 'condition',
//         label: 'Condition',
//         type: 'select',
//         options: ['Brand New', 'Used - Excellent', 'Used - Good', 'Used - Fair'],
//         required: true
//       }
//     ],
//     'Three Wheelers': [
//       {
//         name: 'make',
//         label: 'Make',
//         type: 'select',
//         options: ['Bajaj', 'TVS', 'Piaggio', 'Mahindra', 'Other'],
//         required: true
//       },
//       {
//         name: 'model',
//         label: 'Model',
//         type: 'text',
//         required: true,
//         placeholder: 'e.g., RE 4S, King'
//       },
//       {
//         name: 'year',
//         label: 'Year of Manufacture',
//         type: 'select',
//         options: Array.from({length: 25}, (_, i) => String(2024 - i)),
//         required: true
//       },
//       {
//         name: 'mileage',
//         label: 'Mileage (km)',
//         type: 'number',
//         required: true,
//         placeholder: 'e.g., 25000'
//       },
//       {
//         name: 'fuelType',
//         label: 'Fuel Type',
//         type: 'select',
//         options: ['Petrol', 'Diesel', 'LPG'],
//         required: true
//       },
//       {
//         name: 'condition',
//         label: 'Condition',
//         type: 'select',
//         options: ['Brand New', 'Used - Excellent', 'Used - Good', 'Used - Fair'],
//         required: true
//       }
//     ],
//     'Commercial Vehicles': [
//       {
//         name: 'vehicleType',
//         label: 'Vehicle Type',
//         type: 'select',
//         options: ['Truck', 'Bus', 'Van', 'Lorry', 'Trailer', 'Other'],
//         required: true
//       },
//       {
//         name: 'make',
//         label: 'Make',
//         type: 'select',
//         options: ['Tata', 'Ashok Leyland', 'Mahindra', 'Isuzu', 'Hino', 'Mitsubishi', 'Other'],
//         required: true
//       },
//       {
//         name: 'model',
//         label: 'Model',
//         type: 'text',
//         required: true
//       },
//       {
//         name: 'year',
//         label: 'Year of Manufacture',
//         type: 'select',
//         options: Array.from({length: 30}, (_, i) => String(2024 - i)),
//         required: true
//       },
//       {
//         name: 'mileage',
//         label: 'Mileage (km)',
//         type: 'number',
//         required: true
//       },
//       {
//         name: 'fuelType',
//         label: 'Fuel Type',
//         type: 'select',
//         options: ['Diesel', 'Petrol'],
//         required: true
//       },
//       {
//         name: 'condition',
//         label: 'Condition',
//         type: 'select',
//         options: ['Brand New', 'Used - Excellent', 'Used - Good', 'Used - Fair'],
//         required: true
//       }
//     ],
//     'Boats': [
//       {
//         name: 'boatType',
//         label: 'Boat Type',
//         type: 'select',
//         options: ['Fishing Boat', 'Speed Boat', 'Yacht', 'Sail Boat', 'Other'],
//         required: true
//       },
//       {
//         name: 'length',
//         label: 'Length (feet)',
//         type: 'number',
//         required: true,
//         placeholder: 'e.g., 25'
//       },
//       {
//         name: 'year',
//         label: 'Year of Manufacture',
//         type: 'select',
//         options: Array.from({length: 40}, (_, i) => String(2024 - i)),
//         required: true
//       },
//       {
//         name: 'engineType',
//         label: 'Engine Type',
//         type: 'select',
//         options: ['Outboard', 'Inboard', 'Sail Only', 'Other'],
//         required: false
//       },
//       {
//         name: 'enginePower',
//         label: 'Engine Power (HP)',
//         type: 'number',
//         required: false,
//         placeholder: 'e.g., 40'
//       },
//       {
//         name: 'condition',
//         label: 'Condition',
//         type: 'select',
//         options: ['Brand New', 'Used - Excellent', 'Used - Good', 'Used - Fair'],
//         required: true
//       }
//     ]
//   };

//   const fields = vehicleFields[subcategory] || [];

//   if (fields.length === 0) {
//     return null;
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">
//           {subcategory} Details
//         </h3>
//         <p className="text-gray-600 text-sm mb-6">
//           Provide specific details about your {subcategory.toLowerCase()}
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {fields.map(field => (
//           <div key={field.name} className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               {field.label}
//               {field.required && <span className="text-red-500 ml-1">*</span>}
//             </label>

//             {field.type === 'select' ? (
//               <select
//                 value={vehicleData[field.name] || ''}
//                 onChange={(e) => handleFieldChange(field.name, e.target.value)}
//                 className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                   errors[field.name] ? 'border-red-500' : 'border-gray-300'
//                 }`}
//               >
//                 <option value="">Select {field.label}</option>
//                 {field.options.map(option => (
//                   <option key={option} value={option}>{option}</option>
//                 ))}
//               </select>
//             ) : (
//               <input
//                 type={field.type}
//                 value={vehicleData[field.name] || ''}
//                 onChange={(e) => handleFieldChange(field.name, e.target.value)}
//                 className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                   errors[field.name] ? 'border-red-500' : 'border-gray-300'
//                 }`}
//                 placeholder={field.placeholder}
//                 {...(field.type === 'number' && { min: 0 })}
//               />
//             )}

//             {errors[field.name] && (
//               <p className="text-red-500 text-sm">{errors[field.name]}</p>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
};

export default VehicleAdForm;
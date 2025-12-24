import React from 'react';
import SellerLayout from '../layout/SellerLayout';
import ProductForm from '../products/ProductForm';
import { useAuth } from '../../../context/AuthContext';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AddProduct = () => {
  const { user } = useAuth();

  console.log("user", user.status);
  
  return (
    <SellerLayout>
      <div className="relative">
        {user?.status === 'pending_verification' && (
          <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-sm flex items-start justify-center pt-20">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 shadow-lg max-w-md mx-4 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Account Verification Pending</h2>
              <p className="text-sm text-gray-700 mb-4">
                Wait until Admin approves you as a seller to sell products on Nayagara.lk. 
                Once status is active you can do work as normal.
                (Note: After approval you might have to login again)
              </p>
              <Link 
                to="/seller/dashboard" 
                className="inline-flex items-center space-x-2 text-sm text-primary-600 font-medium hover:text-primary-700"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
        )}
        <div className={user?.status === 'pending_verification' ? 'pointer-events-none opacity-50' : ''}>
          <ProductForm />
        </div>
      </div>
    </SellerLayout>
  );
};

export default AddProduct;
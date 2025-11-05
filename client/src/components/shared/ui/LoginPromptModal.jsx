import React from 'react';
import { LogIn, AlertTriangle } from 'lucide-react';

const LoginPromptModal = ({ isOpen, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
        <p className="text-gray-600 mb-6">Please log in to your account to continue.</p>
        <button
          onClick={onConfirm}
          className="w-full bg-gradient-primary text-white py-3 px-6 rounded-lg font-bold hover:shadow-green transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <LogIn className="w-5 h-5" />
          <span>Proceed to Login</span>
        </button>
      </div>
    </div>
  );
};

export default LoginPromptModal;

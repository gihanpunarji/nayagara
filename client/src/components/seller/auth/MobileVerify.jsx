import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, ArrowLeft, RotateCcw } from 'lucide-react';

const SellerMobileVerify = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    console.log('OTP submitted:', otpValue);
  };

  const handleResendOtp = () => {
    setCountdown(60);
    setCanResend(false);
    console.log('Resending OTP...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <Phone className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Verify Your Phone</h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a 6-digit code to your mobile number
          </p>
          <p className="text-lg font-semibold text-primary-600 mt-2">+94 77 123 4567</p>
        </div>

        <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-green" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Enter 6-digit code
            </label>
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 text-sm">
            {canResend ? (
              <button
                type="button"
                onClick={handleResendOtp}
                className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Resend Code</span>
              </button>
            ) : (
              <p className="text-gray-600">
                Resend code in <span className="font-semibold text-primary-600">{countdown}s</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={otp.some(digit => !digit)}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-primary hover:shadow-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Verify & Continue
          </button>

          <div className="text-center">
            <Link
              to="/seller-login"
              className="inline-flex items-center text-sm text-gray-600 hover:text-primary-600"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerMobileVerify;
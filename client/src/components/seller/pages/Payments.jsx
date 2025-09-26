import React from 'react';
import SellerLayout from '../layout/SellerLayout';
import PaymentDashboard from '../payments/PaymentDashboard';

const Payments = () => {
  return (
    <SellerLayout>
      <PaymentDashboard />
    </SellerLayout>
  );
};

export default Payments;
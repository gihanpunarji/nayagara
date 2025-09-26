import React from 'react';
import SellerLayout from '../layout/SellerLayout';
import OrderManagement from '../orders/OrderManagement';

const Orders = () => {
  return (
    <SellerLayout>
      <OrderManagement />
    </SellerLayout>
  );
};

export default Orders;
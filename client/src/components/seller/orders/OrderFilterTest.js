// Test file to verify order filtering functionality

const testOrderData = [
  { id: 'ORD-001', status: 'pending', customer: { name: 'John Doe' }, product: { title: 'iPhone' } },
  { id: 'ORD-002', status: 'confirmed', customer: { name: 'Jane Smith' }, product: { title: 'MacBook' } },
  { id: 'ORD-003', status: 'processing', customer: { name: 'Bob Wilson' }, product: { title: 'iPad' } },
  { id: 'ORD-004', status: 'shipped', customer: { name: 'Alice Brown' }, product: { title: 'AirPods' } },
  { id: 'ORD-005', status: 'delivered', customer: { name: 'Charlie Davis' }, product: { title: 'Apple Watch' } },
  { id: 'ORD-006', status: 'cancelled', customer: { name: 'Diana Miller' }, product: { title: 'iMac' } },
  { id: 'ORD-007', status: 'refunded', customer: { name: 'Edward Jones' }, product: { title: 'Mac Mini' } }
];

const statusFilters = [
  { key: 'all', label: 'All Orders', count: 0, color: 'bg-gray-100 text-gray-600' },
  { key: 'pending', label: 'Pending', count: 0, color: 'bg-orange-100 text-orange-600' },
  { key: 'confirmed', label: 'Confirmed', count: 0, color: 'bg-teal-100 text-teal-600' },
  { key: 'processing', label: 'Processing', count: 0, color: 'bg-blue-100 text-blue-600' },
  { key: 'shipped', label: 'Shipped', count: 0, color: 'bg-purple-100 text-purple-600' },
  { key: 'delivered', label: 'Delivered', count: 0, color: 'bg-green-100 text-green-600' },
  { key: 'cancelled', label: 'Canceled', count: 0, color: 'bg-red-100 text-red-600' },
  { key: 'refunded', label: 'Refunded', count: 0, color: 'bg-yellow-100 text-yellow-600' }
];

// Test filtering functionality
const testFiltering = () => {
  console.log('🧪 Testing Order Filter Functionality\n');
  
  // Update counts
  statusFilters.forEach(filter => {
    if (filter.key === 'all') {
      filter.count = testOrderData.length;
    } else {
      filter.count = testOrderData.filter(order => order.status === filter.key).length;
    }
  });

  console.log('📊 Status Filter Counts:');
  statusFilters.forEach(filter => {
    console.log(`${filter.label}: ${filter.count} orders`);
  });

  console.log('\n🔍 Testing Filter Results:');
  
  // Test each filter
  statusFilters.forEach(filter => {
    let filtered;
    if (filter.key === 'all') {
      filtered = testOrderData;
    } else {
      filtered = testOrderData.filter(order => order.status === filter.key);
    }
    
    console.log(`\n${filter.label} (${filter.key}): ${filtered.length} orders`);
    filtered.forEach(order => {
      console.log(`  - ${order.id}: ${order.status} - ${order.customer.name}`);
    });
  });

  // Test search functionality
  console.log('\n🔍 Testing Search Functionality:');
  
  const searchTests = ['john', 'mac', 'ORD-003'];
  
  searchTests.forEach(query => {
    const searchResults = testOrderData.filter(order =>
      order.id.toLowerCase().includes(query.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(query.toLowerCase()) ||
      order.product.title.toLowerCase().includes(query.toLowerCase())
    );
    
    console.log(`\nSearch "${query}": ${searchResults.length} results`);
    searchResults.forEach(order => {
      console.log(`  - ${order.id}: ${order.customer.name} - ${order.product.title}`);
    });
  });

  console.log('\n✅ Filter testing completed!');
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testFiltering, testOrderData, statusFilters };
} else {
  // Browser environment
  testFiltering();
}

export { testFiltering, testOrderData, statusFilters };
const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testCategoryAPI() {
  console.log('🧪 Testing Category API Endpoints\n');
  
  const tests = [
    {
      name: 'All Products',
      url: `${BASE_URL}/products/public`,
      expected: 'Should return all products'
    },
    {
      name: 'Electronics Category',
      url: `${BASE_URL}/products/public?category=electronics`,
      expected: 'Should return iPhone, Samsung, Dell laptop'
    },
    {
      name: 'Fashion Category', 
      url: `${BASE_URL}/products/public?category=fashion`,
      expected: 'Should return Maxi Dress'
    },
    {
      name: 'Books & Media Category',
      url: `${BASE_URL}/products/public?category=books-media`,
      expected: 'Should return Love Hypothesis book'
    },
    {
      name: 'Mobile Phones Subcategory',
      url: `${BASE_URL}/products/public?category=electronics&subcategory=1`,
      expected: 'Should return iPhone and Samsung'
    },
    {
      name: 'Laptops Subcategory',
      url: `${BASE_URL}/products/public?category=electronics&subcategory=2`,
      expected: 'Should return Dell laptop'
    },
    {
      name: 'Women Clothing Subcategory',
      url: `${BASE_URL}/products/public?category=fashion&subcategory=6`,
      expected: 'Should return Maxi Dress'
    },
    {
      name: 'Categories with Subcategories',
      url: `${BASE_URL}/categories-with-subcategories`,
      expected: 'Should return category structure'
    }
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    try {
      console.log(`📋 Testing: ${test.name}`);
      console.log(`🔗 URL: ${test.url}`);
      
      const response = await axios.get(test.url);
      
      if (response.status === 200 && response.data.success) {
        const data = response.data.data;
        const count = Array.isArray(data) ? data.length : 'N/A';
        
        console.log(`✅ Success: ${count} items returned`);
        
        if (Array.isArray(data) && data.length > 0) {
          console.log(`📦 Items:`);
          data.forEach((item, index) => {
            if (item.product_title) {
              console.log(`   ${index + 1}. ${item.product_title} (Category: ${item.category_name || 'Unknown'})`);
            } else if (item.category_name) {
              console.log(`   ${index + 1}. ${item.category_name} (${item.subcategories?.length || 0} subcategories)`);
            }
          });
        }
        
        passedTests++;
      } else {
        console.log(`❌ Failed: ${response.data.message || 'Unknown error'}`);
      }
      
    } catch (error) {
      console.log(`💥 Error: ${error.response?.data?.message || error.message}`);
    }
    
    console.log(`💭 Expected: ${test.expected}`);
    console.log('─'.repeat(50));
  }

  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Category filtering is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check your server and database.');
  }
}

// Run tests
if (require.main === module) {
  testCategoryAPI()
    .then(() => {
      process.exit(0);
    })
    .catch(error => {
      console.error('Test suite failed:', error.message);
      process.exit(1);
    });
}

module.exports = { testCategoryAPI };
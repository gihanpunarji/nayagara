const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Configuration
const SERVER_BASE_URL = 'http://localhost:3001';
const UPLOAD_DIR = path.join(__dirname, '../../uploads/sample-images');

// Sample product data templates
const productTemplates = {
  1: { // Mobile Phones
    products: [
      {
        title: "Apple iPhone 15 Pro Max",
        description: "The most advanced iPhone with titanium design, A17 Pro chip, and Pro camera system for stunning photos and videos.",
        price: 450000,
        stock: 25,
        dynamicFields: {
          brand: "Apple",
          storage: "256GB",
          ram: "8GB",
          battery: 4441,
          warranty: 12
        },
        images: ["https://picsum.photos/800/600?random=1"]
      },
      {
        title: "Samsung Galaxy S24 Ultra",
        description: "Premium Android smartphone with S Pen, 200MP camera, and powerful Snapdragon processor.",
        price: 380000,
        stock: 30,
        dynamicFields: {
          brand: "Samsung",
          storage: "256GB",
          ram: "8GB",
          battery: 5000,
          warranty: 24
        },
        images: ["https://picsum.photos/800/600?random=2"]
      }
    ]
  },
  2: { // Laptops
    products: [
      {
        title: "MacBook Pro 16-inch M3 Pro",
        description: "Professional laptop with M3 Pro chip, 16-inch Liquid Retina XDR display, and all-day battery life.",
        price: 650000,
        stock: 15,
        dynamicFields: {
          brand: "Apple",
          processor: "Apple M3 Pro",
          ram: "16GB",
          storage: "SSD",
          graphics: true
        },
        images: ["https://picsum.photos/800/600?random=3"]
      },
      {
        title: "Dell XPS 15 9530",
        description: "High-performance laptop with Intel Core i7 processor, NVIDIA RTX graphics, and stunning 4K display.",
        price: 450000,
        stock: 20,
        dynamicFields: {
          brand: "Dell",
          processor: "Intel i7",
          ram: "16GB",
          storage: "SSD",
          graphics: true
        },
        images: ["https://picsum.photos/800/600?random=4"]
      }
    ]
  },
  6: { // Women Clothing
    products: [
      {
        title: "Elegant Summer Maxi Dress",
        description: "Beautiful flowing maxi dress perfect for summer occasions. Made with breathable cotton blend fabric. Available in multiple sizes and colors. Machine washable for easy care.",
        price: 8500,
        stock: 50,
        dynamicFields: {
          brand: "Fashion Forward",
          size: "M",
          color: "Blue",
          material: "Cotton Blend",
          wash_care: "Machine wash cold, hang dry"
        },
        images: ["https://picsum.photos/600/800?random=5"]
      },
      {
        title: "Professional Blazer Set",
        description: "Stylish two-piece blazer set ideal for office wear and professional meetings.",
        price: 12000,
        stock: 35,
        dynamicFields: {
          brand: "Corporate Style",
          size: "L",
          color: "Black",
          material: "Polyester",
          wash_care: "Dry clean only"
        },
        images: ["https://picsum.photos/600/800?random=6"]
      }
    ]
  },
  10: { // Kitchen Appliances
    products: [
      {
        title: "Multi-Function Air Fryer 5L",
        description: "Healthy cooking made easy with this versatile air fryer. Cook, bake, grill, and roast with little to no oil.",
        price: 25000,
        stock: 40,
        dynamicFields: {
          material: "Plastic",
          dimensions: "35x30x32 cm",
          weight: 4.5,
          warranty: 24
        },
        images: ["https://picsum.photos/800/600?random=7"]
      },
      {
        title: "Stainless Steel Pressure Cooker 6L",
        description: "Heavy-duty pressure cooker for fast and efficient cooking. Perfect for busy households.",
        price: 8500,
        stock: 60,
        dynamicFields: {
          material: "Metal",
          dimensions: "25x25x20 cm",
          weight: 2.8,
          warranty: 12
        },
        images: ["https://picsum.photos/800/600?random=8"]
      }
    ]
  },
  13: { // Haircare
    products: [
      {
        title: "Organic Argan Oil Hair Serum",
        description: "Nourishing hair serum with pure argan oil for smooth, shiny, and healthy hair.",
        price: 3500,
        stock: 100,
        dynamicFields: {
          brand: "Natural Beauty",
          skin_type: "Normal",
          ingredients: "Argan Oil, Vitamin E, Natural Extracts",
          expiry_date: "2026-12-31"
        },
        images: ["https://picsum.photos/600/800?random=9"]
      },
      {
        title: "Keratin Repair Shampoo 500ml",
        description: "Professional keratin shampoo for damaged and dry hair. Restores strength and shine.",
        price: 2800,
        stock: 80,
        dynamicFields: {
          brand: "Hair Expert",
          skin_type: "Dry",
          ingredients: "Keratin, Collagen, Biotin",
          expiry_date: "2026-08-15"
        },
        images: ["https://picsum.photos/600/800?random=10"]
      }
    ]
  },
  15: { // Fitness Equipment
    products: [
      {
        title: "Adjustable Dumbbell Set 20kg",
        description: "Space-saving adjustable dumbbells perfect for home workouts. Easy weight adjustment system.",
        price: 18000,
        stock: 25,
        dynamicFields: {
          brand: "FitPro",
          type: "Dumbbell",
          weight_capacity: 20,
          is_foldable: false
        },
        images: ["https://picsum.photos/800/600?random=11"]
      },
      {
        title: "Foldable Exercise Bike",
        description: "Compact foldable exercise bike with digital display. Perfect for cardio workouts at home.",
        price: 35000,
        stock: 15,
        dynamicFields: {
          brand: "HomeFit",
          type: "Cycle",
          weight_capacity: 120,
          is_foldable: true
        },
        images: ["https://picsum.photos/800/600?random=12"]
      }
    ]
  },
  18: { // Car Accessories
    products: [
      {
        title: "Premium Car Floor Mats Set",
        description: "High-quality rubber floor mats designed to protect your car interior from dirt and moisture.",
        price: 6500,
        stock: 45,
        dynamicFields: {
          brand: "Toyota",
          model: "Prius",
          mileage: 0
        },
        images: ["https://picsum.photos/800/600?random=13"]
      },
      {
        title: "Car Phone Mount Dashboard",
        description: "Universal phone mount for dashboard with 360-degree rotation and secure grip.",
        price: 2200,
        stock: 70,
        dynamicFields: {
          brand: "Honda",
          model: "Civic",
          mileage: 0
        },
        images: ["https://picsum.photos/800/600?random=14"]
      }
    ]
  }
};

// Create upload directory if it doesn't exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Function to download image from URL
async function downloadImage(url, filename) {
  try {
    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'stream'
    });

    const filepath = path.join(UPLOAD_DIR, filename);
    const writer = fs.createWriteStream(filepath);
    
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(filepath));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Error downloading image: ${error.message}`);
    return null;
  }
}

// Function to create a product through API
async function createProduct(productData, subcategoryId, sellerId) {
  try {
    // Get auth token for the seller (you may need to implement this)
    const authToken = await getSellerToken(sellerId);
    
    const formData = new FormData();
    
    // Add basic product data
    formData.append('title', productData.title);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('stock', productData.stock);
    formData.append('category', getCategoryIdBySubcategoryId(subcategoryId));
    formData.append('subcategory', subcategoryId);
    formData.append('dynamicFields', JSON.stringify(productData.dynamicFields));

    // Download and add images
    for (let i = 0; i < productData.images.length; i++) {
      const imageUrl = productData.images[i];
      const filename = `product_${subcategoryId}_${Date.now()}_${i}.jpg`;
      const imagePath = await downloadImage(imageUrl, filename);
      
      if (imagePath) {
        formData.append('images', fs.createReadStream(imagePath), filename);
      }
    }

    // Make API request
    const response = await axios.post(`${SERVER_BASE_URL}/api/products`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (response.data.success) {
      console.log(`✅ Created product: ${productData.title}`);
      return response.data.data;
    } else {
      console.error(`❌ Failed to create product: ${productData.title} - ${response.data.message}`);
      return null;
    }

  } catch (error) {
    console.error(`❌ Error creating product ${productData.title}:`, error.response?.data?.message || error.message);
    return null;
  }
}

// Function to get category ID by subcategory ID
function getCategoryIdBySubcategoryId(subcategoryId) {
  const categoryMapping = {
    1: 1, 2: 1, 3: 1, 4: 1, // Electronics
    5: 2, 6: 2, 7: 2, 8: 2, // Fashion
    9: 3, 10: 3, 11: 3, // Home & Living
    12: 4, 13: 4, 14: 4, // Beauty & Health
    15: 5, 16: 5, 17: 5, // Sports
    18: 6, 19: 6, 20: 6, // Automotive
    21: 7, 22: 7, 23: 7, // Books & Media
    24: 8, 25: 8, 26: 8, 27: 8, // Groceries
    28: 9, 29: 9, 30: 9 // Toys & Games
  };
  return categoryMapping[subcategoryId] || 1;
}

// Updated category mapping with correct IDs
const categoryMappings = {
  1: { categoryId: 1, name: "Electronics" }, // Mobile Phones
  2: { categoryId: 1, name: "Electronics" }, // Laptops
  6: { categoryId: 2, name: "Fashion" }, // Women Clothing
  10: { categoryId: 3, name: "Home & Living" }, // Kitchen Appliances
  13: { categoryId: 4, name: "Beauty & Health" }, // Haircare
  15: { categoryId: 5, name: "Sports" }, // Fitness Equipment
  18: { categoryId: 6, name: "Automotive" } // Car Accessories
};

// Function to get seller authentication token
async function getSellerToken(sellerId) {
  try {
    // This is a simplified approach - you might need to implement proper authentication
    // For now, we'll assume there's a test seller account or generate a token
    
    // You can either:
    // 1. Create a test seller login API call
    // 2. Use an existing seller token
    // 3. Modify your auth to allow admin token for this script
    
    const loginResponse = await axios.post(`${SERVER_BASE_URL}/api/auth/seller/login`, {
      email: 'test@seller.com', // You'll need to create this seller or use existing one
      password: 'testpassword'
    });

    if (loginResponse.data.success) {
      return loginResponse.data.token;
    }
    
    throw new Error('Failed to get seller token');
    
  } catch (error) {
    console.error('Authentication error:', error.message);
    throw error;
  }
}

// Main function to insert all sample products
async function insertSampleProducts() {
  console.log('🚀 Starting sample product insertion...');
  
  const sellerId = 1; // You may need to adjust this based on your test seller
  let successCount = 0;
  let failureCount = 0;

  for (const [subcategoryId, subcategoryData] of Object.entries(productTemplates)) {
    console.log(`\n📁 Processing subcategory ${subcategoryId}...`);
    
    for (const productData of subcategoryData.products) {
      const result = await createProduct(productData, parseInt(subcategoryId), sellerId);
      
      if (result) {
        successCount++;
      } else {
        failureCount++;
      }
      
      // Add small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('\n🎉 Sample product insertion completed!');
  console.log(`✅ Successfully created: ${successCount} products`);
  console.log(`❌ Failed to create: ${failureCount} products`);

  // Clean up downloaded images (optional)
  console.log('\n🧹 Cleaning up temporary image files...');
  try {
    const files = fs.readdirSync(UPLOAD_DIR);
    for (const file of files) {
      fs.unlinkSync(path.join(UPLOAD_DIR, file));
    }
    fs.rmdirSync(UPLOAD_DIR);
    console.log('✅ Cleanup completed');
  } catch (error) {
    console.log('⚠️ Cleanup failed:', error.message);
  }
}

// Add a simpler version that doesn't require authentication for testing
async function insertSampleProductsSimple() {
  console.log('🚀 Starting simple sample product insertion (no auth)...');
  
  for (const [subcategoryId, subcategoryData] of Object.entries(productTemplates)) {
    console.log(`\n📁 Processing subcategory ${subcategoryId}...`);
    
    for (const productData of subcategoryData.products) {
      console.log(`📦 Product: ${productData.title}`);
      console.log(`   Price: Rs. ${productData.price}`);
      console.log(`   Stock: ${productData.stock}`);
      console.log(`   Dynamic Fields:`, productData.dynamicFields);
      console.log(`   Images: ${productData.images.length} image(s)`);
    }
  }
  
  console.log('\n📋 Sample data prepared. To actually insert products:');
  console.log('1. Ensure your server is running on port 3001');
  console.log('2. Create a test seller account or update the authentication logic');
  console.log('3. Run: node src/scripts/insertSampleProducts.js');
}

// Export functions for use
module.exports = {
  insertSampleProducts,
  insertSampleProductsSimple,
  productTemplates
};

// Run the script if called directly
if (require.main === module) {
  // Check if server is running
  axios.get(`${SERVER_BASE_URL}/api/health`)
    .then(() => {
      console.log('✅ Server is running, proceeding with product insertion...');
      return insertSampleProducts();
    })
    .catch(() => {
      console.log('⚠️ Server is not running or health check failed. Showing sample data instead...');
      return insertSampleProductsSimple();
    })
    .finally(() => {
      process.exit(0);
    });
}
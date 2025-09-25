# API Integration Structure

This directory contains API integration files separated by user type for clean code organization.

## Structure

- **customer/** - Customer-related API calls (auth, products, orders, etc.)
- **seller/** - Seller-related API calls (dashboard, product management, sales, etc.)
- **admin/** - Admin-related API calls (user management, analytics, system settings, etc.)
- **shared/** - Common API utilities (axios config, error handling, etc.)

## Usage

Each user type has their own API modules to keep the codebase clean and maintainable:

```javascript
// Customer APIs
import { login, register } from '../api/customer/auth'
import { getProducts, getProductDetails } from '../api/customer/products'

// Seller APIs
import { getSellerDashboard } from '../api/seller/dashboard'
import { addProduct, editProduct } from '../api/seller/products'

// Admin APIs
import { getUserList, banUser } from '../api/admin/users'
import { getSystemStats } from '../api/admin/analytics'
```

This separation makes debugging easier and keeps related API calls together.
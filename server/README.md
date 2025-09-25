# Nayagara Server Package

## Overview
This package contains the backend API server for the Nayagara e-commerce platform. Built with **Node.js**, **Express**, and **MySQL**, it provides modular APIs organized by user roles.

## 🏗️ **New Modular Architecture**

The server is now organized by user roles for better maintainability and clear separation of concerns:

```
server/
├── src/
│   ├── modules/
│   │   ├── customer/         # Customer-specific APIs
│   │   │   ├── controllers/  # Customer business logic
│   │   │   ├── routes/       # Customer API routes
│   │   │   └── services/     # Customer services
│   │   ├── seller/           # Seller-specific APIs
│   │   │   ├── controllers/  # Seller business logic
│   │   │   ├── routes/       # Seller API routes
│   │   │   └── services/     # Seller services
│   │   ├── admin/            # Admin-specific APIs
│   │   │   ├── controllers/  # Admin business logic
│   │   │   ├── routes/       # Admin API routes
│   │   │   └── services/     # Admin services
│   │   └── shared/           # Shared components
│   │       ├── models/       # Database models
│   │       ├── middleware/   # Express middleware
│   │       ├── utils/        # Utility functions
│   │       ├── config/       # Database & app config
│   │       └── routes/       # Common API routes
│   └── server.js            # Main server entry point
├── .env                     # Environment variables
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL (running on localhost:3306)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# Start development server
npm run dev

# Start production server
npm start
```

### Environment Variables
Create a `.env` file in the server root with:
```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=nayagara_db
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h
```

## 🚀 **User Role Modules**

### 🛒 **Customer Module**
**Location:** `src/modules/customer/`

**What's included:**
- **Authentication:** Registration, login, password reset
- **Profile Management:** Account settings, preferences
- **Order Management:** Order placement, tracking, history
- **Cart Operations:** Add, remove, update cart items

**API Base Path:** `/api/customer/`

**When to use:** Customer-facing functionality like user registration, shopping cart operations, order management, and customer authentication.

### 🏪 **Seller Module**
**Location:** `src/modules/seller/`

**What's included:**
- **Authentication:** Seller registration with business details, login
- **Product Management:** CRUD operations for products
- **Order Fulfillment:** Processing seller orders
- **Business Analytics:** Sales reports, inventory tracking
- **Mobile Verification:** Required for seller accounts

**API Base Path:** `/api/seller/`

**When to use:** Seller/vendor functionality like product management, order fulfillment, business analytics, and seller authentication with mobile verification.

### 👨‍💼 **Admin Module**
**Location:** `src/modules/admin/`

**What's included:**
- **User Management:** Manage customers and sellers
- **System Configuration:** Platform settings
- **Analytics & Reporting:** System-wide metrics
- **Content Moderation:** Review and moderate content

**API Base Path:** `/api/admin/`

**When to use:** Administrative functionality like user management, system configuration, platform analytics, and administrative authentication.

### 🔄 **Shared Module**
**Location:** `src/modules/shared/`

**What's included:**
- **Models:** Database models (User, Address, etc.)
- **Middleware:** Authentication, validation middleware
- **Utils:** Input validation, mobile verification
- **Config:** Database connection, app configuration
- **Common Routes:** OTP sending/verification

**API Base Path:** `/api/common/`

**When to use:** Shared functionality used across multiple user roles like database models, common utilities, and cross-role services.

## API Endpoints

### Customer APIs (`/api/customer/auth/`)
- `POST /register` - Customer registration
- `POST /login` - Customer login
- `POST /forgot-password` - Password reset request
- `POST /reset-password` - Reset password with token

### Seller APIs (`/api/seller/auth/`)
- `POST /register` - Seller registration (requires business details)
- `POST /login` - Seller login (requires mobile verification)
- `POST /forgot-password` - Seller password reset

### Admin APIs (`/api/admin/auth/`)
- `POST /login` - Admin login

### Common APIs (`/api/common/`)
- `POST /send-otp` - Send mobile OTP
- `POST /verify-otp` - Verify mobile OTP

### Health Check
- `GET /` - Server status
- `GET /api/health` - Health check endpoint

## Database Schema

### Users Table
The application expects a `users` table with the following columns:
- `user_id` (Primary Key)
- `user_email` (Unique)
- `user_password` (Hashed)
- `first_name`
- `last_name`
- `user_mobile`
- `nic`
- `user_type`
- `user_status`
- `email_verified`
- `mobile_verified`
- `profile_image`
- `last_login`
- `created_at`
- `updated_at`

## Features

### Authentication System
- User registration with validation
- Email/mobile login
- JWT token-based authentication
- Password hashing with bcrypt
- Strong password requirements

### Security Features
- CORS configuration
- JWT token expiration
- Password hashing
- Input validation
- SQL injection protection (parameterized queries)

## Development

### Scripts
```bash
npm run dev    # Start with nodemon (auto-restart)
npm start      # Start production server
npm test       # Run tests (not configured yet)
```

### Code Structure
- **Controllers**: Handle HTTP requests and business logic
- **Models**: Database interactions and data validation
- **Routes**: API endpoint definitions
- **Middleware**: Authentication and request processing
- **Config**: Database and application configuration

### Adding New Features
1. **Identify the user role:** Determine if the feature belongs to customer, seller, admin, or shared
2. **Create components in the appropriate module:**
   - Add controller in `/src/modules/{role}/controllers/`
   - Add route in `/src/modules/{role}/routes/`
   - Add service in `/src/modules/{role}/services/` if needed
3. **For shared functionality:** Use `/src/modules/shared/`
4. **Update server.js:** Mount new routes if needed
5. **Update README:** Document new endpoints and functionality

### Module Guidelines
- **Customer Module:** End-user shopping functionality
- **Seller Module:** Business/vendor functionality (requires mobile verification)
- **Admin Module:** Administrative and management functionality
- **Shared Module:** Common functionality used across roles

## Error Handling
All API responses follow this format:
```javascript
// Success
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}

// Error
{
  "success": false,
  "message": "Error description"
}
```

## Dependencies

### Production
- `express` - Web framework
- `mysql2` - MySQL client
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT tokens
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

### Development
- `nodemon` - Auto-restart development server

## Contributing
1. Read the README files in each directory for context
2. Follow existing code patterns
3. Add appropriate error handling
4. Update documentation when adding features

## Support
For questions about the codebase, check the README files in each directory for detailed documentation about specific components.
# Nayagara Client Package

## Overview
This package contains the frontend user interfaces for the Nayagara e-commerce platform. Built with **React**, it provides separate UI experiences for three distinct user roles.

## User Roles & Components

### 🛒 **Customer Interface**
**Location:** `src/components/customer/`

**What's included:**
- **Authentication:** Login, Registration, Password Reset
- **Shopping:** Product browsing, search, cart management
- **User Account:** Profile management, order history
- **Checkout:** Order placement and payment processing

**When to use:** Customer-facing features like product catalog, shopping cart, user registration, and order management.

### 🏪 **Seller Interface**
**Location:** `src/components/seller/`

**What's included:**
- **Authentication:** Seller login, registration with business details
- **Dashboard:** Sales analytics, order management
- **Product Management:** Add, edit, delete products
- **Business Tools:** Inventory tracking, seller profile management

**When to use:** Seller/vendor features like product management, order fulfillment, sales dashboard, and business analytics.

### 👨‍💼 **Admin Interface**
**Location:** `src/components/admin/` (Future implementation)

**What's included:**
- **System Management:** User management, platform settings
- **Analytics:** Platform-wide metrics and reporting
- **Moderation:** Content moderation, dispute resolution
- **Configuration:** System configuration and maintenance tools

**When to use:** Administrative features like user management, system configuration, platform analytics, and content moderation.

## Shared Components
**Location:** `src/components/shared/` and `src/components/layout/`

**What's included:**
- **UI Components:** Buttons, forms, modals, navigation
- **Layout Components:** Headers, footers, sidebars
- **Utilities:** Helper functions, custom hooks
- **Styling:** Global styles and theme configuration

## Technology Stack
- **Framework:** React 18+
- **Styling:** CSS3, CSS Modules
- **State Management:** React Context API / useState
- **Routing:** React Router
- **HTTP Client:** Axios
- **Build Tool:** Vite

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation
```bash
cd client
npm install
```

### Development
```bash
npm run dev
```
Access the application at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## Project Structure
```
client/
├── src/
│   ├── components/
│   │   ├── customer/        # Customer UI components
│   │   ├── seller/          # Seller UI components
│   │   ├── admin/           # Admin UI components
│   │   └── shared/          # Shared UI components
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API service functions
│   ├── utils/               # Utility functions
│   └── styles/              # Global styles
├── public/                  # Static assets
└── package.json            # Dependencies and scripts
```

## API Integration
The client communicates with the server through RESTful APIs:
- **Customer APIs:** `/api/customer/*`
- **Seller APIs:** `/api/seller/*`
- **Admin APIs:** `/api/admin/*`
- **Common APIs:** `/api/common/*`

## Contributing
When adding new features:
1. Identify the correct user role (customer/seller/admin)
2. Place components in the appropriate directory
3. Use shared components for common functionality
4. Follow existing naming conventions and code structure

## Development Guidelines
- **Component Naming:** Use PascalCase for component files
- **Styling:** Use CSS modules for component-specific styles
- **State Management:** Keep state as local as possible, lift up when needed
- **API Calls:** Use the services layer for all API interactions
- **Error Handling:** Implement proper error boundaries and user feedback

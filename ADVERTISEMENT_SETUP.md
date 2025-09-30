# Advertisement System Setup Guide

This guide will help you set up the new advertisement system for vehicles and properties in your Nayagara multi-seller platform.

## 🚀 Quick Setup

### 1. Database Setup

First, set up the database tables for the advertisement system:

```bash
cd server
npm run setup-db
```

This will create the following tables:
- `advertisements` - Main advertisement data
- `ad_payments` - Payment packages and transactions
- `cities` - Location data for filtering

### 2. Server Setup

Make sure your server is running with the advertisement routes:

```bash
cd server
npm run dev
```

The advertisement API will be available at `http://localhost:5001/api/advertisements`

### 3. Client Setup

Start the React client:

```bash
cd client
npm run dev
```

## 📋 Features Implemented

### ✅ **Advertisement Categories**

**Vehicles:**
- Cars (make, model, year, mileage, fuel type, transmission, engine capacity, color, condition)
- Motorcycles (make, model, year, mileage, engine capacity, color, condition)
- Three Wheelers (make, model, year, mileage, fuel type, condition)
- Commercial Vehicles (vehicle type, make, model, year, mileage, fuel type, condition)
- Boats (boat type, length, year, engine type, engine power, condition)

**Property:**
- Houses (type, bedrooms, bathrooms, floor area, land size, condition, parking, furnished, address)
- Land (land type, land size in perches/acres, frontage, road access, utilities, clear title, address)
- Apartments (type, floor, total floors, floor area, bedrooms, bathrooms, parking, furnished, amenities, address)
- Commercial Property (type, floor area, floors, parking, facilities, condition, address)
- Rooms (room type, attached bathroom, furnished, facilities, gender preference, address)

### ✅ **Payment Packages**

- **Standard** - Free posting (30 days visibility)
- **Urgent** - Rs. 500 (priority placement, urgent badge, 30 days)
- **Featured** - Rs. 1000 (top placement, featured badge, 45 days, homepage featuring)

### ✅ **User Features**

- **Post Ad** - Available to any logged-in user (not just sellers)
- **My Ads** - Manage posted advertisements in account section
- **Ad Details** - Dedicated view with Call Now button and safety warnings
- **Location Filtering** - Filter by district and city
- **Search & Filter** - Search with category and location filters

### ✅ **Admin Features**

- **Ad Management** - Review and approve/reject advertisements
- **Admin Dashboard** - Accessible via `/admin/advertisements`
- **Approval System** - All ads require admin approval before going live

### ✅ **Safety Features**

- **Call Now Button** - Direct dialer integration on mobile devices
- **Safety Warnings** - Prominent warnings about online payments and verification
- **No Seller Requirement** - Any logged-in customer can post ads

## 🔧 API Endpoints

### Public Endpoints
- `GET /api/advertisements` - Get all approved advertisements (with filtering)
- `GET /api/advertisements/:id` - Get single advertisement details
- `GET /api/advertisements/packages` - Get package information

### User Endpoints (Requires Authentication)
- `POST /api/advertisements` - Create new advertisement
- `GET /api/advertisements/user/my-ads` - Get user's advertisements
- `PUT /api/advertisements/:id` - Update advertisement
- `DELETE /api/advertisements/:id` - Delete advertisement

### Admin Endpoints (Requires Admin Role)
- `GET /api/advertisements/admin/pending` - Get pending advertisements
- `POST /api/advertisements/admin/:id/approve` - Approve advertisement
- `POST /api/advertisements/admin/:id/reject` - Reject advertisement

## 🔄 Routes Added

### Client Routes
- `/post-ad` - Post new advertisement (protected)
- `/ad/:id` - View advertisement details
- `/ads` - Browse all advertisements
- `/ads/vehicles` - Browse vehicle advertisements
- `/ads/property` - Browse property advertisements
- `/account` - Updated with "My Ads" section
- `/admin/advertisements` - Admin advertisement management

## 🐛 Fixed Issues

1. **Duplicate `getStatusColor` function** - Renamed to `getAdStatusColor` for ad status
2. **Missing routes** - Added all advertisement-related routes
3. **Authentication** - Added proper `useAuth` import and logout function
4. **404 errors** - All advertisement pages now properly routed

## 🚦 How to Use

### For Users:
1. **Login/Register** as a customer
2. **Click "Post Ad"** in the header
3. **Choose category** (Vehicles or Property)
4. **Fill in details** including vehicle/property specific fields
5. **Select package** (Standard, Urgent, or Featured)
6. **Submit for approval**
7. **Manage ads** in Account → My Ads section

### For Admins:
1. **Login to admin panel**
2. **Navigate to Advertisements** in the sidebar
3. **Review pending ads**
4. **Approve or reject** with optional notes
5. **View ad details** before making decisions

## 💡 Key Differences from Regular Products

- **No Add to Cart** - Advertisements are for contact only
- **Call Now Button** - Direct phone integration instead of purchase buttons
- **Admin Approval** - All ads must be approved before going live
- **Location Based** - Heavy focus on location filtering (city/district)
- **Contact Focused** - Designed for direct seller-buyer contact
- **Safety Warnings** - Clear warnings about payment safety

## 🔐 Security Notes

- All advertisements require admin approval before going live
- User authentication required for posting
- Contact numbers are visible but with safety warnings
- No direct payment processing through the platform for ads
- Clear disclaimers about platform responsibility

Your advertisement system is now ready to use! Users can post vehicle and property ads, admins can manage them, and the system includes all the safety features and location-based filtering as requested.
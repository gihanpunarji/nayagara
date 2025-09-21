# Models

This directory contains data models and database interaction logic.

## Files

### User.js
- **Purpose**: User model for authentication and user management
- **Database Table**: `users`
- **Key Methods**:
  - `findByEmail(email)` - Find user by email address
  - `findByMobile(mobile)` - Find user by mobile number
  - `findById(id)` - Find user by user ID
  - `findByEmailOrMobile(identifier)` - Find user by email or mobile
  - `create({mobile, email, password, firstName, lastName})` - Create new user
  - `comparePassword(plainPassword, hashedPassword)` - Verify password

## Database Schema
```sql
users table columns:
- user_id (primary key)
- user_email
- user_password (hashed)
- first_name
- last_name
- user_mobile
- nic
- user_type ('customer', 'admin', etc.)
- user_status ('active', 'inactive')
- email_verified (boolean)
- mobile_verified (boolean)
- profile_image
- last_login
- created_at
- updated_at
```

## Usage
```javascript
const User = require('./User');

// Find user
const user = await User.findByEmail('user@example.com');

// Create user
const newUser = await User.create({
  mobile: '1234567890',
  email: 'user@example.com',
  password: 'securePassword',
  firstName: 'John',
  lastName: 'Doe'
});
```
# Routes

This directory contains route definitions that map HTTP endpoints to controller functions.

## Files

### authRoutes.js
- **Purpose**: Authentication-related routes
- **Base Path**: `/api/auth`
- **Routes**:
  - `POST /register` - User registration
  - `POST /login` - User login

## Route Structure
```javascript
const express = require('express');
const router = express.Router();
const { controllerFunction } = require('../controllers/controllerFile');

router.method('/endpoint', controllerFunction);
module.exports = router;
```

## Authentication Routes Detail

### POST /api/auth/register
- **Controller**: `authController.register`
- **Purpose**: Create new user account
- **Request Body**:
  ```javascript
  {
    "mobile": "1234567890",
    "email": "user@example.com", 
    "password": "StrongPass123!",
    "confirmPassword": "StrongPass123!",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```
- **Response**:
  ```javascript
  {
    "success": true,
    "message": "User registered successfully",
    "user": { /* user object without password */ },
    "token": "jwt_token_here"
  }
  ```

### POST /api/auth/login
- **Controller**: `authController.login`
- **Purpose**: Authenticate existing user
- **Request Body**:
  ```javascript
  {
    "emailOrMobile": "user@example.com",
    "password": "StrongPass123!"
  }
  ```
- **Response**:
  ```javascript
  {
    "success": true,
    "message": "Login successful",
    "user": { /* user object without password */ },
    "token": "jwt_token_here"
  }
  ```

## Usage in Server
Routes are mounted in `server.js`:
```javascript
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
```

## Adding New Routes
1. Create new route file in this directory
2. Import required controllers
3. Define routes using Express router
4. Export the router
5. Mount in `server.js`
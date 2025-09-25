# Middleware

This directory contains middleware functions that execute during the request-response cycle.

## Files

### auth.js
- **Purpose**: JWT authentication middleware for protecting routes
- **Function**: `authenticateToken(req, res, next)`

## Authentication Middleware Detail

### authenticateToken
- **Purpose**: Verify JWT tokens and authenticate users
- **Process**:
  1. Extract Bearer token from Authorization header
  2. Verify token using JWT secret
  3. Find user from database using token payload
  4. Add user object to `req.user`
  5. Call `next()` to continue to route handler

- **Usage**:
  ```javascript
  const { authenticateToken } = require('../middleware/auth');
  
  // Protect a route
  router.get('/protected', authenticateToken, (req, res) => {
    // req.user contains authenticated user data
    res.json({ user: req.user });
  });
  ```

- **Error Responses**:
  - **401**: No token provided
    ```javascript
    {
      "success": false,
      "message": "Access token required"
    }
    ```
  - **401**: User not found
    ```javascript
    {
      "success": false,
      "message": "Invalid token"
    }
    ```
  - **403**: Invalid/expired token
    ```javascript
    {
      "success": false,
      "message": "Invalid or expired token"
    }
    ```

## Expected Authorization Header Format
```
Authorization: Bearer <jwt_token>
```

## Middleware Flow
```
Request → authenticateToken → Route Handler → Response
          ↓ (if token invalid)
          Error Response
```

## Adding New Middleware
1. Create middleware function that accepts `(req, res, next)`
2. Perform necessary checks/modifications
3. Call `next()` to continue or send error response
4. Export the function
5. Import and use in routes
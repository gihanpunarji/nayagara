# Controllers

This directory contains business logic controllers that handle HTTP requests and responses.

## Files

### authController.js
- **Purpose**: Authentication logic for user registration and login
- **Routes Handled**: `/api/auth/register`, `/api/auth/login`
- **Key Functions**:
  - `register(req, res)` - Handle user registration
  - `login(req, res)` - Handle user login
  - `generateToken(userId)` - Generate JWT tokens

## Functions Detail

### register
- **Input**: `{ mobile, email, password, confirmPassword, firstName, lastName }`
- **Validations**:
  - All required fields present
  - Valid email format
  - Strong password (8+ chars, uppercase, lowercase, number, special char)
  - Password confirmation match
- **Output**: User object + JWT token
- **Status Codes**: 201 (success), 400 (validation error), 500 (server error)

### login
- **Input**: `{ emailOrMobile, password }`
- **Process**: 
  - Find user by email or mobile
  - Verify password with bcrypt
  - Generate JWT token
- **Output**: User object + JWT token
- **Status Codes**: 200 (success), 401 (invalid credentials), 500 (server error)

## Error Handling
All controllers include try-catch blocks and return standardized error responses:
```javascript
{
  success: false,
  message: "Error description"
}
```

## Usage Example
```javascript
const { register, login } = require('./authController');

// Use in routes
router.post('/register', register);
router.post('/login', login);
```
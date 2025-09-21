# Nayagara Server

Backend API server for the Nayagara application built with Node.js, Express, and MySQL.

## Project Structure

```
server/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.js  # MySQL connection setup
│   │   └── README.md
│   ├── controllers/     # Business logic controllers
│   │   ├── authController.js  # Authentication logic
│   │   └── README.md
│   ├── middleware/      # Express middleware
│   │   ├── auth.js      # JWT authentication middleware
│   │   └── README.md
│   ├── models/          # Data models and database interactions
│   │   ├── User.js      # User model
│   │   └── README.md
│   ├── routes/          # API route definitions
│   │   ├── authRoutes.js  # Authentication routes
│   │   └── README.md
│   └── server.js        # Main server file
├── .env                 # Environment variables
├── package.json         # Dependencies and scripts
└── README.md           # This file
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

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

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
1. Create model in `/src/models/` if needed
2. Create controller in `/src/controllers/`
3. Create routes in `/src/routes/`
4. Add middleware if required
5. Mount routes in `server.js`
6. Update relevant README files

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
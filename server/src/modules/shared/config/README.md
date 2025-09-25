# Config

This directory contains configuration files for the application.

## Files

### database.js
- **Purpose**: MySQL database connection and configuration
- **Functions**:
  - `connectDB()` - Establish database connection
  - `getConnection()` - Get current database connection

## Database Configuration

### connectDB()
- **Purpose**: Initialize MySQL connection and setup database
- **Process**:
  1. Create connection using mysql2/promise
  2. Create database if it doesn't exist
  3. Use the specified database
  4. Return connection object
- **Error Handling**: Exits process if connection fails

### getConnection()
- **Purpose**: Return the current database connection
- **Usage**: Used by models to execute queries

## Environment Variables
The database configuration uses the following environment variables:

```bash
# Database Configuration
DB_HOST=localhost          # MySQL host (default: localhost)
DB_USER=root              # MySQL username (default: root)
DB_PASSWORD=your_password # MySQL password (default: empty)
DB_NAME=nayagara_db      # Database name (default: nayagara_db)

# JWT Configuration
JWT_SECRET=your_secret_key    # JWT signing secret
JWT_EXPIRES_IN=24h           # Token expiration time
```

## Database Connection Flow
```
Server Start → connectDB() → Database Ready → Models Use getConnection()
```

## Usage in Models
```javascript
const { getConnection } = require('../config/database');

class Model {
  static async someMethod() {
    const connection = getConnection();
    const [rows] = await connection.execute('SELECT * FROM table');
    return rows;
  }
}
```

## Database Setup Requirements
1. MySQL server running on specified host/port
2. User with appropriate privileges
3. Database will be created automatically if it doesn't exist
4. Environment variables properly configured

## Error Scenarios
- **Connection Failed**: Server exits with error message
- **Invalid Credentials**: Authentication error logged
- **Database Creation Failed**: Permission or syntax errors
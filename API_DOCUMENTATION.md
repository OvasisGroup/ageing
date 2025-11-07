# Registration API Documentation

## Overview
This is a user registration API built with Next.js App Router that supports creating users with username, email, password, and role fields.

## API Endpoint

### POST `/api/auth/register`

Creates a new user account.

#### Request Body
```json
{
  "username": "string (3-20 characters, alphanumeric + underscore)",
  "email": "string (valid email format)",
  "password": "string (min 8 chars, must contain uppercase, lowercase, and number)",
  "role": "string (optional: 'USER' | 'ADMIN' | 'MODERATOR', defaults to 'USER')"
}
```

#### Response (Success - 201)
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "role": "string",
    "createdAt": "ISO date string"
  }
}
```

#### Response (Validation Error - 400)
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "string",
      "message": "string"
    }
  ]
}
```

#### Response (Conflict - 409)
```json
{
  "error": "An account with this email already exists"
}
```

### GET `/api/auth/register`

Retrieves all registered users (for testing purposes).

#### Response (Success - 200)
```json
{
  "users": [
    {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "role": "string",
      "createdAt": "ISO date string"
    }
  ],
  "count": "number"
}
```

## Validation Rules

### Username
- Length: 3-20 characters
- Characters: Only letters, numbers, and underscores
- Must be unique

### Email
- Must be a valid email format
- Converted to lowercase
- Must be unique

### Password
- Minimum 8 characters
- Must contain at least one lowercase letter
- Must contain at least one uppercase letter
- Must contain at least one number
- Hashed using bcrypt with 12 salt rounds

### Role
- Optional field (defaults to 'USER')
- Allowed values: 'USER', 'ADMIN', 'MODERATOR'

## Testing

Visit `/test-register` to access a test interface where you can:
- Register new users
- View all registered users
- Test validation errors

## Example Usage

### JavaScript/TypeScript
```javascript
const registerUser = async (userData) => {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

// Usage
const result = await registerUser({
  username: 'john_doe',
  email: 'john@example.com',
  password: 'SecurePass123',
  role: 'USER'
});
```

### cURL
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "role": "USER"
  }'
```

## Security Features

- Passwords are hashed using bcrypt with 12 salt rounds
- Input validation using Zod schema
- Duplicate email/username prevention
- Password strength requirements
- Proper error handling and logging

## Dependencies

- `bcryptjs`: Password hashing
- `zod`: Input validation
- `next`: App Router framework
- `@prisma/client`: Database ORM client
- `prisma`: Database toolkit and schema management
- `dotenv`: Environment variable loading

## Production Considerations

## Database Integration

This API now uses **PostgreSQL** with **Prisma ORM** for data persistence. The database schema includes:

- Unique constraints on username and email
- Password hashing with bcrypt (12 salt rounds)
- Role-based access control with enum values
- Timestamps for created and updated records

### Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  username  String   @unique
  email     String   @unique
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

enum Role {
  USER
  ADMIN
  MODERATOR
}
```

## Production Considerations

For production use, consider:

1. ✅ **Database**: Now uses PostgreSQL with Prisma ORM
2. Remove the GET endpoint or add proper authentication
3. Add rate limiting to prevent abuse
4. Implement proper logging and monitoring
5. Add CORS configuration if needed
6. Consider adding email verification
7. Implement proper session management or JWT tokens
8. Set up database connection pooling
9. Add database backup and recovery procedures

## File Structure

```
app/
├── api/
│   └── auth/
│       └── register/
│           └── route.ts          # Main API endpoint
├── test-register/
│   └── page.tsx                  # Test interface
lib/
└── auth-api.ts                   # Client-side API functions
types/
└── auth.ts                       # TypeScript type definitions
```
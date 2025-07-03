# Bookstore REST API

A RESTful API for a bookstore application built with Node.js and Express, featuring JWT authentication and file-based data persistence.

## Features

- **User Authentication**: JWT-based authentication system
- **Book Management**: Full CRUD operations for books
- **File-based Persistence**: Data stored in JSON files
- **User Authorization**: Users can only modify their own books
- **Search & Filtering**: Search books by genre
- **Pagination**: Paginated book listings
- **Request Logging**: All requests are logged with timestamps
- **Error Handling**: Comprehensive error handling and validation
- **Unit Tests**: Jest test suite included

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **uuid** - Unique ID generation
- **Jest & Supertest** - Testing framework

## Project Structure

```
bookstore-api/
├── server.js              # Main application file
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
├── .gitignore            # Git ignore file
├── README.md             # This file
├── data/                 # Data storage directory
│   ├── books.json        # Books data file
│   └── users.json        # Users data file
└── tests/                # Test files
    └── api.test.js       # API tests
```

## Installation & Setup

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd bookstore-api
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```
Edit `.env` and set your JWT secret:
```
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3000
```

4. **Start the server:**
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

#### Login User
```http
POST /login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

### Book Endpoints

> **Note:** All book endpoints require authentication. Include the JWT token in the Authorization header:
> ```
> Authorization: Bearer <your-jwt-token>
> ```

#### Get All Books
```http
GET /books
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of books per page (default: 10)
- `genre` (optional): Filter books by genre

**Response:**
```json
{
  "books": [
    {
      "id": "uuid",
      "title": "Book Title",
      "author": "Author Name",
      "genre": "Fiction",
      "publishedYear": 2023,
      "userId": "user-uuid",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalBooks": 50,
    "limit": 10
  }
}
```

**cURL:**
```bash
curl -X GET http://localhost:3000/books \
  -H "Authorization: Bearer <TOKEN>"
```

#### Get Book by ID
```http
GET /books/:id
Authorization: Bearer <token>
```

**Sample Response:**
```json
{
  "id": "125",
  "title": "1984",
  "author": "George Orwell",
  "genre": "Fiction",
  "publishedYear": 1949,
  "userId": "abc-123",
  "createdAt": "2025-07-01T13:00:00.000Z",
  "updatedAt": "2025-07-01T13:00:00.000Z"
}
```

**cURL:**
```bash
curl -X GET http://localhost:3000/books/125 \
  -H "Authorization: Bearer <TOKEN>"
```

#### Search Books by Genre
```http
GET /books/search?genre=fiction
Authorization: Bearer <token>
```

**Sample Response:**
```json
{
  "books": [
    {
      "id": "125",
      "title": "1984",
      "author": "George Orwell",
      "genre": "Fiction",
      "publishedYear": 1949,
      "userId": "abc-123",
      "createdAt": "2025-07-01T13:00:00.000Z",
      "updatedAt": "2025-07-01T13:00:00.000Z"
    }
  ]
}
```

**cURL:**
```bash
curl -X GET "http://localhost:3000/books/search?genre=fiction" \
  -H "Authorization: Bearer <TOKEN>"
```

#### Add New Book
```http
POST /books
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Book Title",
  "author": "Author Name",
  "genre": "Fiction",
  "publishedYear": 2023
}
```

#### Update Book
```http
PUT /books/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Book Title",
  "author": "Updated Author",
  "genre": "Non-Fiction",
  "publishedYear": 2024
}
```

> **Note:** Users can only update books they created.

#### Delete Book
```http
DELETE /books/:id
Authorization: Bearer <token>
```

> **Note:** Users can only delete books they created.

## Testing with cURL

### 1. Register a new user
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword"
  }'
```

### 2. Login to get token
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword"
  }'
```

### 3. Add a book (replace TOKEN with actual token)
```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "Fiction",
    "publishedYear": 1925
  }'
```

### 4. Get all books
```bash
curl -X GET http://localhost:3000/books \
  -H "Authorization: Bearer TOKEN"
```

### 5. Search books by genre
```bash
curl -X GET "http://localhost:3000/books/search?genre=fiction" \
  -H "Authorization: Bearer TOKEN"
```

## Testing with Postman

1. **Import the collection**: Create a new Postman collection and add the following requests:

2. **Set environment variables**:
   - `baseUrl`: `http://localhost:3000`
   - `token`: (will be set after login)

3. **Test sequence**:
   - Register user → Login → Get token → Test book operations

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (user already exists)
- `500` - Internal Server Error

## Security Features

- **Password Hashing**: User passwords are hashed using bcryptjs
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Request data validation and sanitization
- **User Authorization**: Users can only modify their own books
- **Error Handling**: Secure error messages without sensitive information

## Data Structure

### User Object
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "password": "hashed-password",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

### Book Object
```json
{
  "id": "uuid",
  "title": "Book Title",
  "author": "Author Name",
  "genre": "Fiction",
  "publishedYear": 2023,
  "userId": "user-uuid",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

## 📥 Example GET cURL Requests & Responses

### 1. ✅ Get All Books with Pagination

```http
GET /books?page=1&limit=2
```

**Sample Response:**
```json
{
  "books": [
    {
      "id": "123",
      "title": "The Alchemist",
      "author": "Paulo Coelho",
      "genre": "Fiction",
      "publishedYear": 1988,
      "userId": "abc-123",
      "createdAt": "2025-07-01T12:00:00.000Z",
      "updatedAt": "2025-07-01T12:00:00.000Z"
    },
    {
      "id": "124",
      "title": "Atomic Habits",
      "author": "James Clear",
      "genre": "Self-help",
      "publishedYear": 2018,
      "userId": "abc-123",
      "createdAt": "2025-07-02T10:30:00.000Z",
      "updatedAt": "2025-07-02T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalBooks": 6,
    "limit": 2
  }
}
```

**cURL:**
```bash
curl -X GET "http://localhost:3000/books?page=1&limit=2" \
  -H "Authorization: Bearer <TOKEN>"
```

### 2. 🔍 Search Books by Genre

```http
GET /books/search?genre=fiction
```

**Sample Response:**
```json
{
  "books": [
    {
      "id": "125",
      "title": "1984",
      "author": "George Orwell",
      "genre": "Fiction",
      "publishedYear": 1949,
      "userId": "abc-123",
      "createdAt": "2025-07-01T13:00:00.000Z",
      "updatedAt": "2025-07-01T13:00:00.000Z"
    }
  ]
}
```

**cURL:**
```bash
curl -X GET "http://localhost:3000/books/search?genre=fiction" \
  -H "Authorization: Bearer <TOKEN>"
```

### 3. 📘 Get Book by ID

```http
GET /books/:id
```

**Sample Response:**
```json
{
  "id": "125",
  "title": "1984",
  "author": "George Orwell",
  "genre": "Fiction",
  "publishedYear": 1949,
  "userId": "abc-123",
  "createdAt": "2025-07-01T13:00:00.000Z",
  "updatedAt": "2025-07-01T13:00:00.000Z"
}
```

**cURL:**
```bash
curl -X GET http://localhost:3000/books/125 \
  -H "Authorization: Bearer <TOKEN>"
```

### 4. 🧑💻 Get Books with Filters

```http
GET /books?genre=fiction&page=1&limit=5
```

**Sample Response:**
```json
{
  "books": [
    {
      "id": "123",
      "title": "The Alchemist",
      "author": "Paulo Coelho",
      "genre": "Fiction",
      "publishedYear": 1988,
      "userId": "abc-123",
      "createdAt": "2025-07-01T12:00:00.000Z",
      "updatedAt": "2025-07-01T12:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalBooks": 1,
    "limit": 5
  }
}
```

**cURL:**
```bash
curl -X GET "http://localhost:3000/books?genre=fiction&page=1&limit=5" \
  -H "Authorization: Bearer <TOKEN>"
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and add tests
4. Run tests to ensure they pass
5. Submit a pull request

# BookMyShow Backend API

A complete backend API for a movie ticket booking system similar to BookMyShow, built with Node.js, Express, and MongoDB.

## 🚀 Features

✅ **User Authentication**
- User registration and login with JWT
- Password hashing with bcrypt
- Role-based access control (user/admin)
- Admin registration with role update capability

✅ **Movie Management**
- Search movies by city
- Admin can add, update, delete movies
- Movie details with ratings and duration

✅ **Theatre Management**
- Admin can add, update, delete theatres
- Theatre details with location and seat capacity

✅ **Show Management**
- Admin can create shows for movies in theatres
- Show scheduling with date and time
- Seat pricing configuration
- Get shows by theatre

✅ **Ticket Booking**
- Seat selection with availability check
- Concurrency-safe booking with atomic operations
- Booking history for users

✅ **Admin Panel**
- Complete CRUD operations for movies, theatres, and shows
- Protected admin routes with authentication

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Environment Variables**: dotenv

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bms-express
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/bookmyshow
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=3000
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:3000`

## 📁 Project Structure

```
bookmyshow-backend/
├── models/
│   ├── userSchema.js
│   ├── movieSchema.js
│   ├── theatreSchema.js
│   ├── showSchema.js
│   └── bookingSchema.js
├── routes/
│   ├── authRoutes.js
│   ├── movieroute.js
│   ├── bookingRoutes.js
│   └── adminRoutes.js
├── middleware/
│   └── auth.js
├── server.js
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/register-admin` - Admin registration/role update

### Public Routes
- `GET /api/movies-by-city?city=<city>` - Search movies by city
- `GET /api/theatre/:theatreId/shows` - Get shows by theatre

### Protected Routes (Require JWT Token)

#### Booking Routes
- `GET /api/show/:showId/seats` - Get available seats for a show
- `POST /api/book` - Book tickets with seat selection
- `GET /api/my-bookings` - Get user's booking history

#### Admin Routes (Require Admin Role)
- `GET /api/admin/admin` - Admin panel welcome
- `POST /api/admin/addMovie` - Add a new movie
- `GET /api/admin/movies` - Get all movies
- `PUT /api/admin/movie/:id` - Update a movie
- `DELETE /api/admin/movie/:id` - Delete a movie
- `POST /api/admin/addTheatre` - Add a new theatre
- `GET /api/admin/theatres` - Get all theatres
- `PUT /api/admin/theatre/:id` - Update a theatre
- `DELETE /api/admin/theatre/:id` - Delete a theatre
- `POST /api/admin/addShow` - Add a new show
- `GET /api/admin/shows` - Get all shows
- `PUT /api/admin/show/:id` - Update a show
- `DELETE /api/admin/show/:id` - Delete a show

## 🎯 Complete Booking Process Flow

### Step 1: User Registration/Login
```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890"
  }'

# Response:
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Step 2: Search Movies by City
```bash
curl "http://localhost:3000/api/movies-by-city?city=Mumbai"

# Response:
{
  "city": "Mumbai",
  "movies": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "moviename": "The Avengers",
      "duration": "2h 23m",
      "rating": "PG-13",
      "theatres": [
        {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
          "name": "Cineplex",
          "address": "123 Main St",
          "city": "Mumbai"
        }
      ]
    }
  ]
}
```

### Step 3: Get Shows by Theatre
```bash
curl "http://localhost:3000/api/theatre/64f8a1b2c3d4e5f6a7b8c9d2/shows"

# Response:
{
  "theatreId": "64f8a1b2c3d4e5f6a7b8c9d2",
  "movies": [
    {
      "movie": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "moviename": "The Avengers",
        "duration": "2h 23m",
        "rating": "PG-13"
      },
      "theatre": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "name": "Cineplex",
        "address": "123 Main St",
        "city": "Mumbai",
        "totalSeats": 100
      },
      "shows": [
        {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
          "showDate": "2024-01-15T00:00:00.000Z",
          "showTime": "19:00",
          "availableSeats": 98,
          "bookedSeats": ["A1", "A2"],
          "seatPrice": 250,
          "totalSeats": 100,
          "bookedSeatsCount": 2
        }
      ]
    }
  ]
}
```

### Step 4: Get Available Seats for Show
```bash
curl "http://localhost:3000/api/show/64f8a1b2c3d4e5f6a7b8c9d3/seats"

# Response:
{
  "showId": "64f8a1b2c3d4e5f6a7b8c9d3",
  "totalSeats": 100,
  "bookedSeats": ["A1", "A2"],
  "availableSeats": ["A3", "A4", "A5", "B1", "B2", "B3", ...],
  "seatPrice": 250,
  "availableSeatsCount": 98
}
```

### Step 5: Book Tickets
```bash
curl -X POST http://localhost:3000/api/book \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "showId": "64f8a1b2c3d4e5f6a7b8c9d3",
    "seats": ["A3", "A4"]
  }'

# Response:
{
  "message": "Booking successful",
  "booking": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "show": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
      "showDate": "2024-01-15T00:00:00.000Z",
      "showTime": "19:00"
    },
    "seats": ["A3", "A4"],
    "totalAmount": 500,
    "status": "confirmed",
    "bookingDate": "2024-01-10T10:30:00.000Z"
  }
}
```

### Step 6: View Booking History
```bash
curl -X GET http://localhost:3000/api/my-bookings \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Response:
{
  "bookings": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
      "show": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
        "movie": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
          "moviename": "The Avengers",
          "duration": "2h 23m",
          "rating": "PG-13"
        },
        "theatre": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
          "name": "Cineplex",
          "address": "123 Main St",
          "city": "Mumbai"
        }
      },
      "seats": ["A3", "A4"],
      "totalAmount": 500,
      "status": "confirmed",
      "bookingDate": "2024-01-10T10:30:00.000Z"
    }
  ]
}
```

## 🔧 Admin Setup Process

### Step 1: Register Admin
```bash
# Create new admin user
curl -X POST http://localhost:3000/api/auth/register-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "phone": "1234567890"
  }'

# OR Update existing user to admin
curl -X POST http://localhost:3000/api/auth/register-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "existing-user@example.com",
    "updateExisting": true
  }'
```

### Step 2: Add Movie
```bash
curl -X POST http://localhost:3000/api/admin/addMovie \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{
    "moviename": "The Avengers",
    "duration": "2h 23m",
    "rating": "PG-13"
  }'
```

### Step 3: Add Theatre
```bash
curl -X POST http://localhost:3000/api/admin/addTheatre \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{
    "name": "Cineplex",
    "address": "123 Main St",
    "city": "Mumbai",
    "totalSeats": 100
  }'
```

### Step 4: Add Show
```bash
curl -X POST http://localhost:3000/api/admin/addShow \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{
    "movie": "64f8a1b2c3d4e5f6a7b8c9d1",
    "theatre": "64f8a1b2c3d4e5f6a7b8c9d2",
    "showDate": "2024-01-15",
    "showTime": "19:00",
    "availableSeats": 100,
    "seatPrice": 250
  }'
```
# BookMyShow Backend API

A complete backend API for a movie ticket booking system built with Node.js, Express, and MongoDB.

## 🚀 Features

- User authentication with JWT
- Movie, theatre, and show management
- Seat booking with concurrency safety
- Admin panel with CRUD operations
- Role-based access control

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcryptjs
- **Environment**: dotenv

## 📦 Quick Start

1. **Clone and install**
   ```bash
   git clone https://github.com/GnaniSai/bookmyshow-backend.git
   cd bookmyshow-backend
   npm install
   ```

2. **Environment setup**
   ```env
   MONGO_URI=mongodb://localhost:27017/bookmyshow
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=3000
   ```

3. **Start server**
   ```bash
   npm run dev
   ```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/register-admin` - Admin registration

### Public Routes
- `GET /api/movies-by-city?city=<city>` - Search movies by city
- `GET /api/theatre/:theatreId/shows` - Get shows by theatre

### Protected Routes (JWT Required)
- `GET /api/show/:showId/seats` - Get available seats
- `POST /api/book` - Book tickets
- `GET /api/my-bookings` - Booking history

### Admin Routes (Admin Role Required)
- `POST /api/admin/addMovie` - Add movie
- `GET /api/admin/movies` - Get all movies
- `PUT /api/admin/movie/:id` - Update movie
- `DELETE /api/admin/movie/:id` - Delete movie
- `POST /api/admin/addTheatre` - Add theatre
- `GET /api/admin/theatres` - Get all theatres
- `PUT /api/admin/theatre/:id` - Update theatre
- `DELETE /api/admin/theatre/:id` - Delete theatre
- `POST /api/admin/addShow` - Add show
- `GET /api/admin/shows` - Get all shows
- `PUT /api/admin/show/:id` - Update show
- `DELETE /api/admin/show/:id` - Delete show

## 📝 Sample Data

### User Registration
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```

### Admin Registration
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "phone": "1234567890"
}
```

### Add Movie
```json
{
  "moviename": "The Avengers",
  "duration": "2h 23m",
  "rating": "PG-13"
}
```

### Add Theatre
```json
{
  "name": "Cineplex",
  "address": "123 Main St",
  "city": "Mumbai",
  "totalSeats": 100
}
```

### Add Show
```json
{
  "movie": "64f8a1b2c3d4e5f6a7b8c9d1",
  "theatre": "64f8a1b2c3d4e5f6a7b8c9d2",
  "showDate": "2024-01-15",
  "showTime": "19:00",
  "availableSeats": 100,
  "seatPrice": 250
}
```

### Book Tickets
```json
{
  "showId": "64f8a1b2c3d4e5f6a7b8c9d3",
  "seats": ["A3", "A4"]
}
```

## 🔧 Usage Flow

1. Register user/admin
2. Admin adds movies, theatres, and shows
3. Users search movies by city
4. Users select shows and seats
5. Users book tickets
6. View booking history

## 📁 Project Structure

```
bookmyshow-backend/
├── models/          # Database schemas
├── routes/          # API routes
├── middleware/      # Authentication middleware
├── server.js        # Main server file
└── package.json
```
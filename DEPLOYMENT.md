# MarketVision AI - Deployment Guide

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas connection string)
- Git

## Backend Setup

### 1. Navigate to Server Directory
```bash
cd server
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create .env File
Create a `.env` file in the server directory with the following content:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/marketvision
JWT_SECRET=your_secure_jwt_secret_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 4. Seed Database
```bash
npm run seed
```

This will populate the database with:
- 38 Tamil Nadu districts
- 12 business categories with market gap analysis
- 380+ areas with coordinates and market data

### 5. Start Backend Server
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

## Frontend Setup

### 1. Navigate to Root Directory
```bash
cd ..
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create .env File
Create a `.env` file in the root directory with the following content:

```
VITE_API_URL=http://localhost:5000/api
```

### 4. Start Frontend Development Server
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Production Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect your Vercel project to the GitHub repository
3. Vercel will automatically detect the configuration from `vercel.json`
4. Set environment variables in Vercel dashboard

### Environment Variables for Production

- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A secure random string
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `FRONTEND_URL`: Your production frontend URL
- `BACKEND_URL`: Your production backend URL

## API Endpoints

Test the backend APIs:

- GET `http://localhost:5000/api/districts` - Get all districts
- GET `http://localhost:5000/api/areas` - Get all areas
- POST `http://localhost:5000/api/auth/register` - Register user
- POST `http://localhost:5000/api/auth/login` - Login user

## Testing

```bash
# Run all tests
npm test

# Run server tests only
npm run test:server
```

## Troubleshooting

**MongoDB Connection Error:**
- Verify MongoDB is running
- Check connection string in `server/.env`
- Ensure IP is whitelisted (for MongoDB Atlas)

**Port Already in Use:**
- Change `PORT` in `server/.env`
- Kill process using the port

**Build Errors:**
- Clear node_modules: `Remove-Item -Recurse -Force node_modules`
- Reinstall: `npm install`

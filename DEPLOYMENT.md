# Market Gap Finder - Deployment Guide

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas connection string)
- Git

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create .env File
Create a `.env` file in the backend directory with the following content:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/market-gap-finder
JWT_SECRET=your_secure_jwt_secret_key_here
NODE_ENV=development
```

**Note:** For production, use MongoDB Atlas or a production MongoDB instance and change `NODE_ENV` to `production`.

### 4. Seed Database with Real Tamil Nadu Data
```bash
npm run seed
```

This will populate the database with:
- 38 Tamil Nadu districts with real population data (2011 Census)
- 12 business categories with market gap analysis
- Sample areas with real coordinates and market data

### 5. Start Backend Server
For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

The backend will run on `http://localhost:5000`

## Frontend Setup

### 1. Navigate to Frontend Directory
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

**Note:** For production, change this to your production backend URL.

### 4. Start Frontend Development Server
```bash
npm run dev
```

The frontend will run on `http://localhost:3000` (or another available port)

## Production Deployment

### Backend Deployment (e.g., Vercel, Railway, Render)

1. Push code to GitHub
2. Connect your deployment platform to the GitHub repository
3. Set environment variables:
   - `PORT`: 5000 (or as required by platform)
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your secure JWT secret
   - `NODE_ENV`: production
4. Deploy

### Frontend Deployment (e.g., Vercel, Netlify)

1. Push code to GitHub
2. Connect your deployment platform to the GitHub repository
3. Set environment variable:
   - `VITE_API_URL`: Your production backend URL
4. Deploy

## Database Management

### MongoDB Atlas Setup (Recommended for Production)

1. Create a free MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for all IPs)
5. Get your connection string
6. Update `MONGODB_URI` in backend `.env` file

### Local MongoDB Setup

1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/market-gap-finder`

## Testing the Application

### 1. Test Backend APIs
Use Postman or curl to test endpoints:

- GET `http://localhost:5000/api/districts` - Get all districts
- GET `http://localhost:5000/api/areas` - Get all areas
- POST `http://localhost:5000/api/auth/register` - Register user
- POST `http://localhost:5000/api/auth/login` - Login user

### 2. Test Frontend
1. Open browser to `http://localhost:3000`
2. Try registering a new user
3. Login with registered credentials
4. Navigate through the dashboard
5. Test district selection
6. Test area comparison
7. Test search functionality

## Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
- Verify MongoDB is running
- Check connection string in `.env`
- Ensure IP is whitelisted (for MongoDB Atlas)

**Port Already in Use:**
- Change `PORT` in backend `.env`
- Kill process using the port

### Frontend Issues

**API Connection Error:**
- Verify backend is running
- Check `VITE_API_URL` in frontend `.env`
- Check CORS configuration in backend

**Build Errors:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`

## Security Considerations

1. **Never commit `.env` files** to version control
2. Use strong JWT secrets in production
3. Enable MongoDB authentication
4. Use HTTPS in production
5. Implement rate limiting for APIs
6. Validate all user inputs
7. Keep dependencies updated

## Performance Optimization

1. Enable MongoDB indexing
2. Implement API response caching
3. Use CDN for static assets
4. Enable gzip compression
5. Optimize images and assets
6. Implement lazy loading for components

## Monitoring and Logging

1. Set up application monitoring (e.g., Sentry, LogRocket)
2. Implement error tracking
3. Monitor API response times
4. Track user analytics
5. Set up database performance monitoring

## Backup and Recovery

1. Regular MongoDB backups
2. Backup configuration files
3. Document custom configurations
4. Test restore procedures

## Support

For issues or questions:
- Check the backend README.md for API documentation
- Review the code comments
- Check browser console for frontend errors
- Check backend logs for server errors

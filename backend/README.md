# MarketVision AI Backend

## Setup Instructions

### 1. Create .env file
Create a `.env` file in the backend directory with the following content:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/marketvision
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Seed Database with Real Tamil Nadu Data
```bash
npm run seed
```

This will populate the database with:
- 38 Tamil Nadu districts with real population data
- 12 business categories with market gap analysis
- Sample areas with real coordinates and market data

### 4. Start Development Server
```bash
npm run dev
```

Or for production:
```bash
npm start
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile (protected)
- PUT `/api/auth/profile` - Update user profile (protected)

### Districts
- GET `/api/districts` - Get all districts
- GET `/api/districts/:id` - Get single district
- POST `/api/districts` - Create district (admin)
- PUT `/api/districts/:id` - Update district (admin)
- DELETE `/api/districts/:id` - Delete district (admin)

### Areas
- GET `/api/areas` - Get all areas
- GET `/api/areas/:id` - Get single area
- GET `/api/areas/district/:districtId` - Get areas by district
- POST `/api/areas` - Create area (admin)
- PUT `/api/areas/:id` - Update area (admin)
- DELETE `/api/areas/:id` - Delete area (admin)

### Market Data
- GET `/api/market-data` - Get market data for all areas
- GET `/api/market-data/area/:areaId` - Get market data for specific area
- GET `/api/market-data/district/:districtId` - Get market data for district
- PUT `/api/market-data/area/:areaId` - Update market data (admin)

### Comparison
- POST `/api/comparison/compare` - Compare multiple areas (protected)
- POST `/api/comparison/save` - Save comparison (protected)
- GET `/api/comparison/saved` - Get saved comparisons (protected)
- DELETE `/api/comparison/:id` - Delete comparison (protected)

### Forecasting
- GET `/api/forecasting` - Get forecast data for all areas
- GET `/api/forecasting/area/:areaId` - Get forecast for specific area
- GET `/api/forecasting/district/:districtId` - Get forecast for district

### Search
- GET `/api/search/areas` - Search areas
- GET `/api/search/pincode/:pincode` - Search by pincode
- GET `/api/search/name/:name` - Search by name
- GET `/api/search/suggestions` - Get search suggestions

## Database Models

### District
- name, headquarters, area, population, density, totalBusinesses, coordinates

### Area
- pincode, name, district, coordinates, population, populationGrowth, incomeLevel, urbanDevelopment, searchTrends, competitors, demandScores, marketGapScores

### User
- name, email, password, role, savedComparisons, recentSearches, favoriteAreas

### BusinessCategory
- name, demand, supply, gap, description

## Real Data Included

The database seeding script includes:
- All 38 Tamil Nadu districts with real population data (2011 Census)
- Real coordinates for all district headquarters
- 12 business categories with market gap analysis
- Sample areas with real coordinates and market data

## Notes

- The backend uses MongoDB for data storage
- All API responses follow a consistent format with `success`, `message`, and `data` fields
- Authentication uses JWT tokens
- Passwords are hashed using bcryptjs
- CORS is enabled for frontend integration

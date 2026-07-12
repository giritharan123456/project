# MarketVision AI

An advanced AI-powered MERN stack application to identify market opportunities by analyzing business density, population, demand indicators, and competition data across 38 districts and 380+ areas in Tamil Nadu.

## Tech Stack

- **Frontend**: React 18, Vite 6, Tailwind CSS 3, Recharts, Leaflet, Framer Motion
- **Backend**: Express 5, Mongoose 9, MongoDB, Passport.js (Google OAuth)
- **Testing**: Vitest, Supertest

## Features

- Pincode-wise opportunity analysis with market gap scoring
- Category-wise competitor count and demand analysis
- 5-year population and demand forecasting
- Interactive heat maps with Leaflet
- AI-powered business recommendations
- Area comparison and leaderboard
- Investment estimation calculator
- PDF/CSV report export
- Real-time notifications
- Admin panel for data management
- Google OAuth and JWT authentication
- Guest user support

## Installation

```bash
npm install
```

## Development

```bash
# Frontend (Vite dev server)
npm run dev

# Backend server
npm run server

# Seed database
npm run seed
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

## API Server

The Express backend runs on port 5000 by default. All API endpoints are prefixed with `/api`.

## Project Structure

```
marketvision-ai/
├── api/index.js              # Vercel serverless entry
├── server/
│   ├── server.js             # Express app
│   ├── config/               # Database, Passport config
│   ├── controllers/          # Route handlers
│   ├── middleware/            # Auth, error handling
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API routes
│   ├── services/             # Data fetching logic
│   ├── utils/                # Logger, scoring algorithms
│   └── seed.js               # Database seeder
├── src/
│   ├── components/           # 38 React components
│   ├── pages/                # 29 page components
│   ├── contexts/             # 5 React contexts
│   ├── services/             # API client
│   ├── utils/                # Data utilities
│   └── __tests__/            # Vitest tests
├── index.html                # Vite entry point
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## API Endpoints

- `/api/auth/*` - Authentication (register, login, Google OAuth, password reset)
- `/api/areas/*` - Area data (by pincode, district, search)
- `/api/districts/*` - District data
- `/api/admin/*` - Admin CRUD operations
- `/api/explorer/*` - Leaderboard, categories, matrix, investment estimates
- `/api/comparison/*` - Area comparison
- `/api/analytics/*` - Analytics overview
- `/api/notifications/*` - User notifications
- `/api/workspace/*` - User workspace (favorites, history)
- `/api/ai/*` - AI chat
- `/api/content/*` - CMS content
- `/api/forecasting/*` - Forecast data

## Environment Variables

See `.env.example` for required environment variables.

## Testing

```bash
npm test
```

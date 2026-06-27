# Tamil Nadu Market Gap Finder

A MERN stack application to identify market opportunities across Tamil Nadu pincodes by analyzing business density, population, demand indicators, and competition data.

## Problem Statement

Entrepreneurs and franchise companies often struggle to identify where demand exists but competition is low. Most business decisions are based on assumptions rather than data.

## Solution

Build a data analytics platform that analyzes business density, population, and demand indicators across Tamil Nadu pincodes to identify underserved business opportunities.

## Features

### Core Features
- **Pincode-wise Opportunity Analysis**: Analyze market gaps by specific pincodes across Tamil Nadu
- **Category-wise Competitor Count**: View competitor counts for each business category per pincode
- **Demand Forecasting**: Project future demand based on population growth and search trends
- **Market Gap Score Calculation**: Compute market gap scores using the formula: `Market Gap Score = Demand Score - Competition Score`
- **Interactive Heat Maps**: Visual representation of market opportunities with circle size indicating population and color indicating opportunity level
- **District and Business Category Filters**: Filter data by district and business category
- **Exportable Reports**: Download comprehensive CSV reports with all analysis data

### Detailed Features
- **District Selection**: Select from major Tamil Nadu districts (Chennai, Coimbatore, Madurai, Tiruchirappalli, Salem, Erode)
- **Pincode Search**: Search for specific pincodes within selected districts
- **Business Category Filter**: Filter by business categories (Pharmacy, Supermarket, Restaurant, Coaching Centre, etc.)
- **Ranking Table**: View top opportunities ranked by Market Gap Score with columns for Rank, Pincode, Area, Business Category, Competitors, Demand Score, and Market Gap Score
- **Demand vs Supply Analysis**: 
  - Bar chart showing demand, supply, and gap for each business category
  - Line chart showing demand forecasting with current vs projected demand
  - Bar chart showing market gap score distribution
  - Pie chart showing business category gap share
- **Interactive Heat Map**: 
  - Circle size represents population
  - Color represents market opportunity (Red: High ≥80, Orange: Medium 70-79, Green: Low <70)
  - Detailed popup with population growth, income level, urban development, search trends, and top categories
- **Top Pincodes**: List of pincodes sorted by market opportunity with population, growth rate, and best business category
- **Business Category Summary**: Quick view of business category gaps

## Data Covered

**Districts:**
- Chennai (T. Nagar - 600100, Anna Nagar - 600040)
- Coimbatore (Gandhipuram - 641035, RS Puram - 641002)
- Madurai (KK Nagar - 625020)
- Tiruchirappalli (Srirangam - 620018)
- Salem (Fairlands - 636004)
- Erode (Brough Road - 638001)

**Business Categories:**
- Pharmacy, Supermarket, Restaurant, Coaching Centre

**Metrics per Pincode:**
- Population and population growth rate
- Income level (High/Medium)
- Competitor count per category
- Demand score per category (0-100)
- Market gap score per category (0-100)
- Urban development index (0-100)
- Search trends index (0-100)

## Market Gap Score Formula

```
Market Gap Score = Demand Score - Competition Score
```

Higher score = Better business opportunity

## Example Output

| Rank | Pincode | Business Category | Competitors | Demand Score | Market Gap Score |
|------|---------|------------------|-------------|-------------|-----------------|
| 1    | 600100  | Pharmacy         | 4           | 92          | 88              |
| 2    | 641035  | Supermarket      | 6           | 89          | 83              |
| 3    | 620018  | Coaching Centre  | 3           | 85          | 82              |

## Frontend Stack

- React 18
- Recharts (for charts - Bar, Line, Pie)
- Leaflet & React-Leaflet (for interactive heat maps)
- CSS3 (modern styling with gradients and animations)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view the application

## Project Structure

```
marketgap/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── DistrictSelector.js
│   │   ├── SearchBar.js
│   │   ├── FilterPanel.js
│   │   ├── PincodeAnalysis.js
│   │   ├── ExportButton.js
│   │   ├── ChartsSection.js
│   │   ├── MapSection.js
│   │   └── TopAreas.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Components

- **DistrictSelector**: Dropdown to select Tamil Nadu districts
- **SearchBar**: Search functionality for pincodes within selected district
- **FilterPanel**: Filter data by business category
- **PincodeAnalysis**: Ranking table showing top opportunities by Market Gap Score
- **ExportButton**: Download comprehensive CSV reports
- **ChartsSection**: Display demand vs supply, demand forecasting, market gap distribution, and category share charts
- **MapSection**: Interactive heat map showing pincodes with detailed market gap data
- **TopAreas**: List of pincodes sorted by market opportunity with business category summary

## How It Works

### Step 1: Data Collection
- Census population data
- Google Maps business listings
- Business directories
- Demographic and income data
- Infrastructure information

### Step 2: Calculate Business Density
Example:
- Pincode: 600100
- Population: 1,20,000
- Restaurants: 18
- Restaurant Density: 18 restaurants / 1,20,000 people

### Step 3: Generate Demand Signals
Factors:
- Population size
- Population growth
- Nearby residential projects
- Search trends
- Competitor count
- Income levels
- Urban development indicators

### Step 4: Compute Market Gap Score
```
Market Gap Score = Demand Score - Competition Score
```

## Future Enhancements (Backend)

- MongoDB database for storing business and population data
- Express.js API for data retrieval
- Node.js server for backend logic
- Real-time data integration from Google Maps API
- User authentication and saved reports
- Advanced analytics and reporting
- More Tamil Nadu districts and pincodes
- Historical trend analysis
- Machine learning for demand prediction
- Mobile app development

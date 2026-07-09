const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.test') });

const request = require('supertest');
const mongoose = require('mongoose');

const runServerTests = process.env.RUN_SERVER_TESTS === 'true';
const describeServer = runServerTests ? describe : describe.skip;

let app;
let server;
let token;
let adminToken;
let districtId;
let areaId;
let categoryId;
let notificationId;

beforeAll(async () => {
  if (!runServerTests) {
    return;
  }

  app = require('../server');
  server = app;

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
  await mongoose.connection.asPromise();
  await mongoose.connection.db.dropDatabase();

  const adminRes = await request(server)
    .post('/api/auth/register')
    .send({ name: 'Admin', email: 'admin@test.com', password: 'password123' });
  adminToken = adminRes.body.token;
  await mongoose.model('User').findOneAndUpdate({ email: 'admin@test.com' }, { role: 'admin' });

  const userRes = await request(server)
    .post('/api/auth/register')
    .send({ name: 'User', email: 'user@test.com', password: 'password123' });
  token = userRes.body.token;
});

afterAll(async () => {
  if (!runServerTests) {
    return;
  }

  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});

describeServer('Auth API', () => {
  test('POST /api/auth/register - creates user', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@test.com', password: 'password123' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.name).toBe('Test');
  });

  test('POST /api/auth/register - duplicate email returns 400', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'admin@test.com', password: 'password123' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/login - valid credentials', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  test('POST /api/auth/login - invalid credentials returns 401', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  test('POST /api/auth/guest - creates guest user', async () => {
    const res = await request(server).post('/api/auth/guest');
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user.isGuest).toBe(true);
  });

  test('GET /api/auth/profile - returns profile with valid token', async () => {
    const res = await request(server)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe('admin@test.com');
  });

  test('GET /api/auth/profile - no token returns 401', async () => {
    const res = await request(server).get('/api/auth/profile');
    expect(res.status).toBe(401);
  });
});

describeServer('Districts API', () => {
  test('GET /api/districts - returns empty list initially', async () => {
    const res = await request(server).get('/api/districts');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('POST /api/admin/districts - creates district (admin only)', async () => {
    const res = await request(server)
      .post('/api/admin/districts')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test District' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    districtId = res.body.data._id;
  });

  test('POST /api/admin/districts - non-admin returns 403', async () => {
    const res = await request(server)
      .post('/api/admin/districts')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Should Fail' });
    expect(res.status).toBe(403);
  });

  test('GET /api/districts/:id - returns district', async () => {
    const res = await request(server).get(`/api/districts/${districtId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Test District');
  });
});

describeServer('Areas API', () => {
  test('POST /api/admin/areas - creates area with scores', async () => {
    const res = await request(server)
      .post('/api/admin/areas')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        pincode: '600001',
        name: 'Test Area',
        district: districtId,
        coordinates: { lat: 13.0, lng: 80.2 },
        population: 50000,
        populationGrowth: 2.5,
        incomeLevel: 'Medium',
        urbanDevelopment: 60,
        searchTrends: 50,
        competitors: { Retail: 5, Healthcare: 3 },
        demandScores: { Retail: 80, Healthcare: 70 },
        marketGapScores: { Retail: 75, Healthcare: 65 }
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.feasibilityScore).toBeGreaterThan(0);
    expect(res.body.data.opportunityScore).toBeGreaterThan(0);
    areaId = res.body.data._id;
  });

  test('GET /api/areas - returns all areas', async () => {
    const res = await request(server).get('/api/areas');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBeGreaterThan(0);
  });

  test('GET /api/areas/pincode/:pincode - returns area by pincode', async () => {
    const res = await request(server).get('/api/areas/pincode/600001');
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Test Area');
  });

  test('GET /api/areas/:id - returns area by id', async () => {
    const res = await request(server).get(`/api/areas/${areaId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.pincode).toBe('600001');
  });
});

describeServer('Business Categories API', () => {
  test('POST /api/admin/business-categories - creates category', async () => {
    const res = await request(server)
      .post('/api/admin/business-categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Retail', demand: 80, supply: 40, gap: 40, description: 'Retail stores', minInvestment: 500000, maxInvestment: 3000000 });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    categoryId = res.body.data._id;
  });

  test('GET /api/admin/business-categories - lists categories', async () => {
    const res = await request(server)
      .get('/api/admin/business-categories')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.count).toBeGreaterThan(0);
  });
});

describeServer('Comparison API', () => {
  test('POST /api/comparison/compare - compares areas', async () => {
    const res = await request(server)
      .post('/api/comparison/compare')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ areaIds: [areaId] });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/comparison/save - saves comparison', async () => {
    const res = await request(server)
      .post('/api/comparison/save')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ areaIds: [areaId], name: 'Test Comparison' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describeServer('Search API', () => {
  test('GET /api/search/areas - searches by query', async () => {
    const res = await request(server).get('/api/search/areas?query=Test');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBeGreaterThan(0);
  });

  test('GET /api/search/pincode/:pincode - searches by pincode', async () => {
    const res = await request(server).get('/api/search/pincode/600001');
    expect(res.status).toBe(200);
    expect(res.body.data.pincode).toBe('600001');
  });
});

describeServer('Notifications API', () => {
  test('GET /api/notifications - returns list (auth required)', async () => {
    const res = await request(server)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/notifications - no auth returns 401', async () => {
    const res = await request(server).get('/api/notifications');
    expect(res.status).toBe(401);
  });
});

describeServer('Analytics API', () => {
  test('GET /api/analytics/overview - returns analytics', async () => {
    const res = await request(server).get('/api/analytics/overview');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.marketCoverage).toBeDefined();
    expect(res.body.data.businessOpportunities).toBeDefined();
  });
});

describeServer('Workspace API', () => {
  test('GET /api/workspace/favorites - returns favorites (auth required)', async () => {
    const res = await request(server)
      .get('/api/workspace/favorites')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describeServer('Explorer API', () => {
  test('GET /api/explorer/categories - returns categories', async () => {
    const res = await request(server).get('/api/explorer/categories');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.categories).toBeDefined();
  });

  test('GET /api/explorer/leaderboard - returns leaderboard', async () => {
    const res = await request(server).get('/api/explorer/leaderboard');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.areas).toBeDefined();
  });

  test('GET /api/explorer/matrix - returns matrix', async () => {
    const res = await request(server).get('/api/explorer/matrix');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.matrix).toBeDefined();
  });

  test('GET /api/explorer/estimate - returns estimate', async () => {
    const res = await request(server).get(`/api/explorer/estimate?category=${categoryId}&areaId=${areaId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.estimate.breakdown).toBeDefined();
  });
});

describeServer('Content API', () => {
  test('GET /api/content/landing - returns landing content', async () => {
    const res = await request(server).get('/api/content/landing');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/content/about - returns about content', async () => {
    const res = await request(server).get('/api/content/about');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describeServer('Admin API - Protected Routes', () => {
  test('GET /api/admin/stats - returns stats for admin', async () => {
    const res = await request(server)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.districts).toBeDefined();
  });

  test('GET /api/admin/stats - non-admin returns 403', async () => {
    const res = await request(server)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  test('GET /api/admin/users - returns users for admin', async () => {
    const res = await request(server)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.count).toBeGreaterThan(0);
  });
});

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const logger = require('./utils/logger');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('MongoDB Connected');

    const adminPassword = process.env.ADMIN_PASSWORD || process.argv[2];
    if (!adminPassword) {
      logger.error('Usage: node createAdmin.js <password> or set ADMIN_PASSWORD env var');
      process.exit(1);
    }

    const existingAdmin = await User.findOne({ email: 'admin@marketgap.com' }).lean();
    if (existingAdmin) {
      logger.info('Admin user already exists');
      process.exit(0);
    }

    await User.create({
      name: 'Admin User',
      email: 'admin@marketgap.com',
      password: adminPassword,
      role: 'admin',
      isGuest: false,
      savedComparisons: [],
      recentSearches: [],
      favoriteAreas: []
    });

    logger.info('Admin user created successfully:');
    logger.info('Email: admin@marketgap.com');
    logger.info('Role: admin');

    process.exit(0);
  } catch (error) {
    logger.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();

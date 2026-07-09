const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    const existingAdmin = await usersCollection.findOne({ email: 'admin@marketgap.com' });
    if (existingAdmin) {
      logger.info('Admin user already exists');
      process.exit(0);
    }

    const result = await usersCollection.insertOne({
      name: 'Admin User',
      email: 'admin@marketgap.com',
      password: hashedPassword,
      role: 'admin',
      isGuest: false,
      createdAt: new Date(),
      updatedAt: new Date(),
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

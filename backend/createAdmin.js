const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Hash password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Insert directly into MongoDB to bypass Mongoose hooks
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ email: 'admin@marketgap.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
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

    console.log('Admin user created successfully:');
    console.log('Email: admin@marketgap.com');
    console.log('Password: admin123');
    console.log('Role: admin');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();

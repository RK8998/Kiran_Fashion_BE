require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const UserModel = require('../models/users.js');
const { ROLES } = require('../utils/constants.js');

const seedAdminUser = async () => {
  try {
    // Connect to MongoDB
    const dbURI = NODE_ENV === 'development' ? DEVELOPMENT_DB_URI : PRODUCTION_DB_URI;
    console.log('********', dbURI);
    await mongoose.connect(dbURI);

    const existAdmin = await UserModel.findOne({ email: 'admin@gmail.com' });

    if (existAdmin) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    const adminUser = new UserModel({
      name: 'Super Admin',
      email: 'admin@gmail.com',
      phone: 98798556644,
      password: 'Admin@123',
      role: ROLES.admin,
      isActive: true
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

seedAdminUser();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    const existing = await User.findOne({ role: 'superadmin' });
    if (existing) {
      console.log('⚠️  Superadmin already exists:', existing.email);
      process.exit(0);
    }

    const superAdmin = await User.create({
      name: process.env.SUPERADMIN_NAME,
      email: process.env.SUPERADMIN_EMAIL,
      phone: process.env.SUPERADMIN_PHONE,
      password: process.env.SUPERADMIN_PASSWORD,
      role: 'superadmin',
      isActive: true,
    });

    console.log('✅ Superadmin created successfully');
    console.log('   Name:', superAdmin.name);
    console.log('   Email:', superAdmin.email);
    console.log('   Role:', superAdmin.role);
    console.log('\n⚠️  Change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating superadmin:', error.message);
    process.exit(1);
  }
};

createSuperAdmin();
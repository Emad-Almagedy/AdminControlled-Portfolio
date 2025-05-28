const mongoose = require('mongoose');
const { User, connectDB } = require('./db.cjs');

async function addAdminUser() {
  try {
    await connectDB();

    const existingUser = await User.findOne({ email: 'emadfatah123@gma.com' });
    if (existingUser) {
      console.log('Admin user already exists.');
      process.exit(0);
    }

    const user = new User({
      username: 'emad',
      email: 'emadfatah123@gma.com',
      role: 'admin',
    });
    await user.setPassword('EmadSaeid#234#');
    await user.save();

    console.log('Admin user created successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

addAdminUser();

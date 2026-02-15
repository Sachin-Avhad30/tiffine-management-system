
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { RoleModel } from './model/roleModel';
import { UserModel } from './model/userModel';

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/mydatabase';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log('Connected to MongoDB for seeding');

    // Roles
    const roles = [
      {
        role_name: 'SuperAdmin',
        role_permission: ['all'],
        role_specific_details: [],
      },
      {
        role_name: 'Admin',
        role_permission: ['manage_organization'],
        role_specific_details: [],
      },
      {
        role_name: 'Retailer',
        role_permission: ['manage_menus', 'manage_orders'],
        role_specific_details: [],
      },
      {
        role_name: 'Employee',
        role_permission: ['view_menu', 'place_order'],
        role_specific_details: [],
      },
    ];

    for (const roleData of roles) {
      const existingRole = await RoleModel.findOne({ role_name: roleData.role_name });
      if (!existingRole) {
        await RoleModel.create(roleData);
        console.log(`Role ${roleData.role_name} created`);
      } else {
        console.log(`Role ${roleData.role_name} already exists`);
      }
    }

    // SuperAdmin User
    const superAdminRole = await RoleModel.findOne({ role_name: 'SuperAdmin' });
    if (!superAdminRole) {
      console.error('SuperAdmin role not found, cannot create user');
      return;
    }

    const superAdminEmail = 'superadmin@example.com';
    const existingUser = await UserModel.findOne({ email: superAdminEmail });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('Password@123', 10);
      const superAdminUser = {
        username: 'superadmin',
        email: superAdminEmail,
        password: hashedPassword,
        contact_number: '1234567890',
        address: 'Admin address',
        role_id: superAdminRole._id.toString(), // Store ID as string to match schema
        created_at: new Date(),
        updated_at: new Date(),
        role_specific_details: {},
      };

      await UserModel.create(superAdminUser);
      console.log('SuperAdmin user created');
    } else {
      console.log('SuperAdmin user already exists, updating password');
      const hashedPassword = await bcrypt.hash('Password@123', 10);
      existingUser.password = hashedPassword;
      await existingUser.save();
      console.log('SuperAdmin password updated');
    }

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedDatabase();

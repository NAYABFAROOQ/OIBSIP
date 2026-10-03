import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Inventory from './models/Inventory.js';
import Pizza from './models/Pizza.js';

dotenv.config();

const initialInventory = [
  // 5 Pizza Bases
  { name: 'Thin Crust', category: 'base', stock: 60, threshold: 20, price: 5.0 },
  { name: 'Thick Crust', category: 'base', stock: 55, threshold: 20, price: 6.0 },
  { name: 'Cheese Burst', category: 'base', stock: 45, threshold: 20, price: 8.0 },
  { name: 'Whole Wheat', category: 'base', stock: 40, threshold: 20, price: 6.5 },
  { name: 'Gluten-Free', category: 'base', stock: 35, threshold: 20, price: 7.5 },

  // 5 Sauces
  { name: 'Classic Marinara', category: 'sauce', stock: 70, threshold: 20, price: 1.5 },
  { name: 'Spicy Peri-Peri', category: 'sauce', stock: 50, threshold: 20, price: 2.0 },
  { name: 'Creamy Alfredo', category: 'sauce', stock: 45, threshold: 20, price: 2.5 },
  { name: 'Smoky BBQ Sauce', category: 'sauce', stock: 50, threshold: 20, price: 2.0 },
  { name: 'Fresh Basil Pesto', category: 'sauce', stock: 40, threshold: 20, price: 3.0 },

  // Cheeses
  { name: 'Mozzarella', category: 'cheese', stock: 80, threshold: 20, price: 3.0 },
  { name: 'Sharp Cheddar', category: 'cheese', stock: 50, threshold: 20, price: 3.5 },
  { name: 'Aged Parmesan', category: 'cheese', stock: 40, threshold: 20, price: 4.0 },
  { name: 'Vegan Plant Cheese', category: 'cheese', stock: 30, threshold: 20, price: 4.0 },

  // Vegetables
  { name: 'Portobello Mushrooms', category: 'veggie', stock: 60, threshold: 20, price: 1.5 },
  { name: 'Kalamata Olives', category: 'veggie', stock: 55, threshold: 20, price: 1.5 },
  { name: 'Crisp Bell Peppers', category: 'veggie', stock: 65, threshold: 20, price: 1.2 },
  { name: 'Red Onions', category: 'veggie', stock: 70, threshold: 20, price: 1.0 },
  { name: 'Pickled Jalapeños', category: 'veggie', stock: 50, threshold: 20, price: 1.5 },
  { name: 'Sweet Golden Corn', category: 'veggie', stock: 60, threshold: 20, price: 1.2 }
];

const initialPizzas = [
  {
    name: 'Margherita Classica',
    description: 'Fresh mozzarella, classic San Marzano marinara, and fresh basil leaves on thin crust.',
    price: 12.99,
    category: 'Veg',
    base: 'Thin Crust',
    sauce: 'Classic Marinara',
    cheese: 'Mozzarella',
    veggies: ['Crisp Bell Peppers'],
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500'
  },
  {
    name: 'Garden Harvest Supreme',
    description: 'Loaded with mushrooms, bell peppers, red onions, sweet corn, and rich mozzarella.',
    price: 15.49,
    category: 'Veg',
    base: 'Whole Wheat',
    sauce: 'Classic Marinara',
    cheese: 'Mozzarella',
    veggies: ['Portobello Mushrooms', 'Crisp Bell Peppers', 'Red Onions', 'Sweet Golden Corn'],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500'
  },
  {
    name: 'Fiery Peri-Peri Heat',
    description: 'Spicy peri-peri sauce, jalapeños, cheddar cheese burst, and caramelized red onions.',
    price: 16.99,
    category: 'Specialty',
    base: 'Cheese Burst',
    sauce: 'Spicy Peri-Peri',
    cheese: 'Sharp Cheddar',
    veggies: ['Pickled Jalapeños', 'Red Onions'],
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500'
  },
  {
    name: 'Smoky BBQ Rustic Feast',
    description: 'Thick crust brushed with smoky BBQ sauce, aged parmesan, and grilled mushrooms.',
    price: 17.25,
    category: 'Specialty',
    base: 'Thick Crust',
    sauce: 'Smoky BBQ Sauce',
    cheese: 'Aged Parmesan',
    veggies: ['Portobello Mushrooms', 'Red Onions'],
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500'
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing records
    await Inventory.deleteMany();
    await Pizza.deleteMany();
    await User.deleteMany({ role: 'admin' });

    // Seed Data
    await Inventory.insertMany(initialInventory);
    console.log('✅ Inventory items seeded successfully (Bases, Sauces, Cheeses, Veggies)');

    await Pizza.insertMany(initialPizzas);
    console.log('✅ Preset Pizzas seeded successfully');

    // Create Initial Admin User
    await User.create({
      name: 'System Admin',
      email: 'admin@pizzadelivery.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true
    });
    console.log('✅ Admin User created: admin@pizzadelivery.com / admin123');

    console.log('🎉 Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products (optional)
    await Product.deleteMany({});
    console.log(' Cleared existing products');

    // Add initial products
    const products = [
      {
        name: "Refreshing Fruit Beverage",
        price: 5.0,
        description: "A delicious fruit drink to refresh your day.",
        stock: 100
      },
      {
        name: "Tropical Smoothie",
        price: 6.5,
        description: "Blend of tropical fruits for a perfect smoothie.",
        stock: 75
      },
      {
        name: "Energy Boost Drink",
        price: 4.0,
        description: "Get energized with our special energy drink.",
        stock: 150
      }
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`Added ${createdProducts.length} products`);

    createdProducts.forEach(product => {
      console.log(`   - ${product.name} ($${product.price})`);
    });

    mongoose.connection.close();
    console.log('Database seeding completed!');
    process.exit(0);

  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedProducts();
import mongoose from 'mongoose';

const pizzaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide pizza name'],
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500'
    },
    category: {
      type: String,
      enum: ['Veg', 'Non-Veg', 'Specialty'],
      default: 'Veg'
    },
    base: {
      type: String,
      default: 'Thin Crust'
    },
    sauce: {
      type: String,
      default: 'Classic Marinara'
    },
    cheese: {
      type: String,
      default: 'Mozzarella'
    },
    veggies: [
      {
        type: String
      }
    ]
  },
  { timestamps: true }
);

const Pizza = mongoose.model('Pizza', pizzaSchema);
export default Pizza;
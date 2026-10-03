import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ['base', 'sauce', 'cheese', 'veggie']
    },
    stock: {
      type: Number,
      required: true,
      default: 50,
      min: [0, 'Stock cannot be negative']
    },
    threshold: {
      type: Number,
      default: 20 // Alert threshold requested by Oasis Infobyte
    },
    price: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { timestamps: true }
);

const Inventory = mongoose.model('Inventory', inventorySchema);
export default Inventory;
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [
      {
        pizzaType: {
          type: String,
          enum: ['preset', 'custom'],
          default: 'custom'
        },
        name: {
          type: String,
          default: 'Custom Built Pizza'
        },
        base: {
          type: String,
          required: true
        },
        sauce: {
          type: String,
          required: true
        },
        cheese: {
          type: String,
          required: true
        },
        veggies: [
          {
            type: String
          }
        ],
        quantity: {
          type: Number,
          default: 1
        },
        price: {
          type: Number,
          required: true
        }
      }
    ],
    totalAmount: {
      type: Number,
      required: true
    },
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      phone: { type: String, required: true }
    },
    orderStatus: {
      type: String,
      enum: ['Order Received', 'In Kitchen', 'Sent to Delivery', 'Delivered'],
      default: 'Order Received'
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending'
    },
    razorpayOrderId: String,
    razorpayPaymentId: String
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
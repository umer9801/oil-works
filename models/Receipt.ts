import mongoose from 'mongoose';

const ReceiptItemSchema = new mongoose.Schema({
  itemId: String,
  itemName: String,
  category: String,
  quantity: Number,
  litres: Number, // For oil items
  price: Number,
  costPrice: Number,
  total: Number
}, { _id: false });

const ReceiptSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  customerName: String,
  customerPhone: String,
  vehicleNo: String,
  model: String,
  items: [ReceiptItemSchema],
  usedMileage: Number,
  overMileage: Number,
  newMileage: Number,
  newRunning: Number,
  afterChange: Number,
  subtotal: Number,
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now } // Data stored forever
});

// Add indexes for better query performance
ReceiptSchema.index({ customerId: 1 });
ReceiptSchema.index({ customerName: 1 });
ReceiptSchema.index({ customerPhone: 1 });
ReceiptSchema.index({ vehicleNo: 1 });
ReceiptSchema.index({ createdAt: -1 });

export default mongoose.models.Receipt || mongoose.model('Receipt', ReceiptSchema);

import mongoose from 'mongoose';

const ReceiptItemSchema = new mongoose.Schema({
  itemName: String,
  quantity: Number,
  costPrice: Number,
  salePrice: Number,
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
  createdAt: { type: Date, default: Date.now, expires: 2592000 }
});

export default mongoose.models.Receipt || mongoose.model('Receipt', ReceiptSchema);

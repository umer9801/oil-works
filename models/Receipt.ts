import mongoose from 'mongoose';

const ReceiptSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  vehicleNo: String,
  model: String,
  oil: String,
  oilFilter: String,
  airFilter: { type: String, enum: ['Changed', 'Not Changed'] },
  acFilter: { type: String, enum: ['Changed', 'Not Changed'] },
  usedMileage: Number,
  overMileage: Number,
  newMileage: Number,
  newRunning: Number,
  afterChange: Number,
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now, expires: 2592000 }
});

export default mongoose.models.Receipt || mongoose.model('Receipt', ReceiptSchema);

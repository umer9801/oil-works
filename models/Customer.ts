import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  vehicleNo: { type: String, required: true },
  model: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 2592000 } // 30 days
});

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);

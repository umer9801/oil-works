import mongoose from 'mongoose';

const StockSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, enum: ['oil', 'oil-filter', 'air-filter', 'ac-filter'], required: true },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Stock || mongoose.model('Stock', StockSchema);

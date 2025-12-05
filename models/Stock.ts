import mongoose from 'mongoose';

const StockSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  costPrice: { type: Number, required: true },
  salePrice: { type: Number, required: true },
  category: { type: String, enum: ['oil', 'oil-filter', 'air-filter', 'ac-filter'], required: true },
  updatedAt: { type: Date, default: Date.now }
});

// Add indexes for better query performance
StockSchema.index({ itemName: 1 });
StockSchema.index({ category: 1 });
StockSchema.index({ quantity: 1 });
StockSchema.index({ updatedAt: -1 });

export default mongoose.models.Stock || mongoose.model('Stock', StockSchema);

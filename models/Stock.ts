import mongoose from 'mongoose';

const StockSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  costPrice: { type: Number, required: true },
  salePrice: { type: Number, required: true },
  category: { type: String, enum: ['oil', 'oil-filter', 'air-filter', 'ac-filter'], required: true },
  // For oil category only
  litresPerGallon: { type: Number, default: 0 }, // How many litres in one gallon
  pricePerLitre: { type: Number, default: 0 }, // Price per litre for oil
  totalLitres: { type: Number, default: 0 }, // Total litres available (quantity * litresPerGallon)
  updatedAt: { type: Date, default: Date.now }
});

// Add indexes for better query performance
StockSchema.index({ itemName: 1 });
StockSchema.index({ category: 1 });
StockSchema.index({ quantity: 1 });
StockSchema.index({ updatedAt: -1 });

export default mongoose.models.Stock || mongoose.model('Stock', StockSchema);

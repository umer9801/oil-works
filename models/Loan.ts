import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  note: String
}, { _id: true });

const LoanSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  vehicleNo: String,
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  remainingAmount: { type: Number, required: true },
  payments: [PaymentSchema],
  status: { type: String, enum: ['pending', 'partial', 'paid'], default: 'pending' },
  description: String,
  createdAt: { type: Date, default: Date.now }
});

// Add indexes for better query performance
LoanSchema.index({ customerId: 1 });
LoanSchema.index({ customerName: 1 });
LoanSchema.index({ customerPhone: 1 });
LoanSchema.index({ status: 1 });
LoanSchema.index({ createdAt: -1 });

export default mongoose.models.Loan || mongoose.model('Loan', LoanSchema);

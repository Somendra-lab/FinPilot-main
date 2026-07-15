import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true
  },
  category: String,
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  active: {
    type: Boolean,
    default: true
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  paymentMethod: String,
  notes: String
}, { timestamps: true });

subscriptionSchema.index({ userId: 1, active: 1 });

export default mongoose.model('Subscription', subscriptionSchema);

import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true
  },
  limit: {
    type: Number,
    required: true,
    min: 0
  },
  spent: {
    type: Number,
    default: 0,
    min: 0
  },
  month: {
    type: String,
    required: true
  },
  alerts: {
    threshold: { type: Number, default: 80 },
    enabled: { type: Boolean, default: true }
  }
}, { timestamps: true });

budgetSchema.index({ userId: 1, month: 1 });

export default mongoose.model('Budget', budgetSchema);

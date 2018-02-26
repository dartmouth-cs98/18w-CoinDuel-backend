import mongoose, { Schema } from 'mongoose';

const CapcoinHistorySchema = new Schema({
    gameId: { type: Schema.Types.ObjectId, ref: 'Game' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    balance: { type: Number, default: 0 },
    date: { type: Date }
});

CapcoinHistorySchema.set('toJSON', {
  virtuals: true,
});

const CapcoinHistoryModel = mongoose.model('CapcoinHistory', CapcoinHistorySchema, 'capcoin_history');
export default CapcoinHistoryModel;

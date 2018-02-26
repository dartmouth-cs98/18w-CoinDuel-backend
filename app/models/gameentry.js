import mongoose, { Schema } from 'mongoose';

const GameEntrySchema = new Schema({
    gameId: { type: Schema.Types.ObjectId, ref: 'Game' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    choices: [{ symbol: { type: String }, allocation: { type: Number, min: 0, max: 10 }}],
    coin_balance: { type: Number, default: 0 },
    last_updated: { type: Date }
});

const GameEntryModel = mongoose.model('GameEntry', GameEntrySchema, 'entries');
export default GameEntryModel;

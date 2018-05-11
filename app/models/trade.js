/*
 * trade.js
 *
 * Schema for a user's in-game trade
 * May 10 2018
 * Josh Kerber
 */

import mongoose, { Schema } from 'mongoose';

const TradeSchema = new Schema({
    gameId: { type: Schema.Types.ObjectId, ref: 'Game' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    choices: [{ symbol: { type: String }, allocation: { type: Number, min: 0, max: 10 }, price: { type: Number, default: null }}],
    timestamp: { type: Date, default: Date.now },
    initial: { type: Boolean, default: false }
});

const TradeModel = mongoose.model('Trade', TradeSchema, 'trades');
export default TradeModel;

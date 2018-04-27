/*
 * gameentry.js
 *
 * Schema for a user's entry into a particular game
 * Feb 12 2018
 * Kooshul Jhaveri
 */

import mongoose, { Schema } from 'mongoose';

const GameEntrySchema = new Schema({
    gameId: { type: Schema.Types.ObjectId, ref: 'Game' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    choices: [{ symbol: { type: String }, allocation: { type: Number, min: 0, max: 10 }}],
    coin_balance: { type: Number, default: 0 },
    last_updated: { type: Date, default: Date.now },
    performanceL [{ time: { type: Number, default: 0 }, unixTime: { type: Number, default: Date.now }, capCoin: {type: Number, default: 0 } }]
});

const GameEntryModel = mongoose.model('GameEntry', GameEntrySchema, 'entries');
export default GameEntryModel;
{
		"time": 26,
		"unixTime": 1524858180,
		"capCoin": -0.027153451842729517
	}

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
    currentChoices: [{ symbol: { type: String }, allocation: { type: Number, min: 0, max: 10 }, initialPrice: {type: Number, default: null }}],
    coin_balance: { type: Number, default: 10 },
    unallocated_capcoin: { type: Number, default: 10},
    trades: [{ symbol: { type: String }, allocation: { type: Number, min: 0, max: 10 }, price: { type: Number, default: null }, timestamp: { type: Date, default: Date.now }}],
    last_updated: { type: Date, default: Date.now },
    game_performance: [{ time: { type: Number, default: 0 }, unixTime: { type: Number, default: Date.now }, capCoin: {type: Number, default: 0 } }]
});

const GameEntryModel = mongoose.model('GameEntry', GameEntrySchema, 'entries');
export default GameEntryModel;

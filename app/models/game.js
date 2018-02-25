import mongoose, { Schema } from 'mongoose';

const GameSchema = new Schema({
    start_date: { type: Date, default: Date.now },
    finish_date: { type: Date },
    coins: [{"name":String, "value":Number}],
});

GameSchema.set('toJSON', {
  virtuals: true,
});

GameSchema.virtual('is_active').get(function () {
  return this.start_date < Date.now() && Date.now() < this.finish_date;
});

GameSchema.virtual('game_finished').get(function () {
  return Date.now() > this.finish_date;
});

const GameModel = mongoose.model('Game', GameSchema);
export default GameModel;

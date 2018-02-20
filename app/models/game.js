import mongoose, { Schema } from 'mongoose';

const GameSchema = new Schema({
    start_date: { type: Date, default: Date.now },
    finish_date: { type: Date },
    coins: [{"name":String, "value":Number}],
});

GameSchema.set('toJSON', {
  virtuals: true,
});

GameSchema.virtual('started').get(function () {
  return Date.now > this.start_date ;
});

const GameModel = mongoose.model('Game', GameSchema);
export default GameModel;

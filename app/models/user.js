// From http://cs52.me/assignments/sa/server-side/

import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  email: String,
  password_hash: String,
  balance: { type: Number, default: 0 },
}, {
  toJSON: {
    virtuals: true,
  },
});

PollSchema.virtual('balanace').get(function balance() {
  return this.balance;
});

// create model class
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;

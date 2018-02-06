// From http://cs52.me/assignments/sa/server-side/

import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  balance: { type: Number, default: 0 },
});

UserSchema.set('toJSON', {
  virtuals: true,
});

UserSchema.virtual('balance').get(function balance() {
  return this.balance;
});



// create model class
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;

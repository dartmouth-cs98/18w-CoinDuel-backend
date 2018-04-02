// From http://cs52.me/assignments/sa/server-side/

import mongoose, { Schema } from 'mongoose';
import dotenv from 'dotenv';
import Cryptr from 'cryptr';

// password encryption
dotenv.config({ silent: true });
const cryptr = new Cryptr(process.env.API_SECRET);

const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  username: String,
  password: String,
  profile_url: { type: String, default: 'profile' },
  coinBalance: { type: Number, default: 0 }
});

UserSchema.set('toJSON', {
  virtuals: true,
});

// encrypt passwords before saving
// based on http://cs52.me/assignments/hw5p2/
UserSchema.pre('save', function beforeyYourModelSave(callback) {
  const user = this;

  // don't hash preexisting passwords
  if (!user.isModified('password')) return callback();

  // generate encrypted password
  var hash = cryptr.encrypt(user.password);
  user.password = hash;
  return callback();
});

// create model class
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;

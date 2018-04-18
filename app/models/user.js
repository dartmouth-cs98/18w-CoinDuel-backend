// From http://cs52.me/assignments/sa/server-side/

import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  username: String,
  password: String,
  verified: { type: Boolean, default: false },
  profile_url: { type: String, default: 'profile' },
  coinBalance: { type: Number, default: 0 }
});

UserSchema.set('toJSON', {
  virtuals: true,
});

// encrypt passwords before saving – based on http://cs52.me/assignments/hw5p2/
UserSchema.pre('save', function beforeyYourModelSave(callback) {
  const user = this;

  // don't hash preexisting passwords
  if (!user.isModified('password')) return callback();

  // generate a salt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return callback(err);

    // hash password
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return callback(err);
      user.password = hash;
      return callback();
    });
  });
});

// compare password hash for auth
UserSchema.methods.comparePassword = function comparePassword(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

// create model class
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;

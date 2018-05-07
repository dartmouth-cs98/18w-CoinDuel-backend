/*
 * passport.js
 *
 * Passport authentication.
 * Based on CS52 auth guide http://cs52.me/assignments/hw5p2/ (URL subject to change)
 * Apr 17 2018
 * Kooshul Jhaveri & Josh Kerber
 * Credits to Tim Tregubov of course
 */

import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user';
import dotenv from 'dotenv';
dotenv.config({ silent: true });

// options for local strategy
const localOptions = { usernameField: 'username' };

// options for jwt strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.API_SECRET
};

// username, password authentication strategy
const localLogin = new LocalStrategy(localOptions, (username, password, done) => {
  User.findOne({ username }, (err, user) => {
    if (err) return done('error-else');
    if (!user) return done('error-username', false);

    // compare candidate password to user.password
    user.comparePassword(password, (err, isMatch) => {
      if (err) done('error-else');
      else if (!isMatch) done('error-password', true);
      else done(null, user);
    });
  });
});

// check database for user ID in the payload
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload.user, (err, user) => {
    if (err) done(err, false);
    else if (user) done(null, user);
    else done(null, false);
  });
});

// set passport procedure
passport.use(jwtLogin);
passport.use(localLogin);
export const requireAuth = passport.authenticate('jwt', { session: false });
export const requireSignin = passport.authenticate('local', { session: false });

/*
 * user_controller.js
 *
 * User endpoints interactions
 * 14 Feb 2018
 * Rajiv Ramaiah
 */

import User from '../models/user.js';
import dotenv from 'dotenv';
import Cryptr from 'cryptr';

// password decryption
dotenv.config({ silent: true });
const cryptr = new Cryptr(process.env.API_SECRET);

export const signup = (req, res, next) => {
  console.log('Signing up user...');
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;

  if (!email || !password || !username) {
    return res.status(422).send('You must provide an email, a password, and a username to sign up!');
  }

  // add query to check if user exists
  User.findOne({ "username": username })
  .then((user) => {
      if (user) {
        return res.status(422).send('The password or email or username you entered has been taken!');
      } else {
        const newUser = new User();
        newUser.email = email;
        newUser.password = password;
        newUser.username = username;
        newUser.coinBalance = 30;
        newUser.save()
        .then((result) => {
          res.send(newUser);
        })
        .catch(err => {
          res.send(`${err}`);
        });
      }
  })
  .catch(err => {
    res.status(400).send(`${err}`);
  });
};

// check if user exists
export const findUser = (req, res) => {
  console.log('Signing in user...');
  console.log(req.body);
  User.findOne({ "username": req.body.username })
  .then((user) => {
      if (user) {

        // decrypt password
        user.password = cryptr.decrypt(user.password);
        res.send(user);
      } else {
        return res.status(422).send('No user found!');
      }
  }).catch(err => {
    res.status(400).send(`${err}`);
  });
};

// return a list of all users in the app
export const getAllUsers = (req, res) => {
  // add query to check if user exists
  User.find()
  .then((users) => {
      if (users) {
        res.send(users);
      } else {
        return res.status(422).send('No users found!');
      }
  }).catch(err => {
    res.status(400).send(`${err}`);
  });
};

// delete a user, used for account deletion
export const deleteUser = (req, res) => {
  User.remove({ "username": req.body.username })
   .then(() => {
     res.json({ message: 'Usage successfully deleted!' });
   }).catch(error => {
     res.json({ error });
   });
};

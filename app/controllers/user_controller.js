/*
 * user_controller.js
 *
 * User endpoints interactions
 * 14 Feb 2018
 * Rajiv Ramaiah
 */

import User from '../models/user.js';
import dotenv from 'dotenv';
import jwt from 'jwt-simple';

// password encryption
dotenv.config({ silent: true });

// generate token upon sign in
export const signin = (req, res) => {
  const username = req.body.username;
  User.findOne({ username })
  .then(myUser => {

    // generate and send back new token
    if (myUser) res.status(200).send({ token: tokenForUser(myUser), user: myUser });
    else res.status(400).send('user \'' + username + '\' not found');
  })
  .catch(err => {
    res.status(400).send(`${err}`);
  });
};

// signup user
export const signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  if (!email || !password || !username) {
    return res.status(422).send('You must provide an email, a password, and a username to sign up!');
  }

  // add query to check if user exists
  User.findOne({
      "username": username
    })
    .then((user) => {
      if (user) {
        return res.status(422).send('The password or email or username you entered has been taken!');
      } else {
        const newUser = new User();
        newUser.email = email;
        newUser.password = password;
        newUser.username = username;
        newUser.coinBalance = 30;
        newUser.verified = false;
        newUser.save()
        .then(result => {

          // return token
          res.status(200).send({ token: tokenForUser(newUser), user: newUser });
        })
        .catch(err => {
          res.status(400).send(`${err}`);
        });
      }
    })
    .catch(err => {
      res.status(400).send(`${err}`);
    });
};

// check if user exists
export const findUser = (req, res) => {
  User.findOne({
      "username": req.body.username
    })
    .then((user) => {
      if (user) {
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
  User.remove({
      "username": req.body.username
    })
    .then(() => {
      res.json({
        message: 'Usage successfully deleted!'
      });
    }).catch(error => {
      res.json({
        error
      });
    });
};

// encodes new token for a user
// based off CS52 passport auth guide http://cs52.me/assignments/hw5p2/ (URL subject to change)
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ user: user.id, iat: timestamp }, process.env.API_SECRET);
}

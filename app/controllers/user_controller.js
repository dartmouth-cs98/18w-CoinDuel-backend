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

const uuidv4 = require('uuid/v4');
const mailgun = require('mailgun-js')({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN, retry: 3});

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
        newUser.profile_url = req.body.profile_url
        newUser.coinBalance = 30;
        newUser.verified = false;
        const verificationId = uuidv4();
        newUser.verificationId = verificationId;
        newUser.save()
        .then(result => {
          var email_html = req.app.locals.resources.mailgun_email1 + username + req.app.locals.resources.mailgun_email2 + verificationId + req.app.locals.resources.mailgun_email3;
          var data = {
            from: 'CoinDuel Mailer <noreply@coinduel.co>',
            to: email,
            subject: 'CoinDuel Email Verification',
            html: email_html,
            inline: '../images/logo.png'
          };
          mailgun.messages().send(data, function (error, body) {
            if (error == undefined) {
              console.log("Succeeded verification");
              res.status(200).send({ token  : tokenForUser(newUser), user: newUser });
            } else {
              console.log("Failed verification. Error: ${error}");
              newUser.remove();
              res.status(400).send('Create user failed – error sending verification email.');
            }
          });
        })
        .catch(err => {
          console.log("Validation error")
          console.log(err)
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

// verify a user
export const verifyUser = (req, res) => {
  User.findOne({ verificationId: req.params.verificationId })
    .then((result) => {
      console.log(result);
      result.update({
        $set: {
          verified: true,
        }
      }, (updateErr, updateRes) => {
          if (updateErr || !updateRes) {
              res.status(400).send('Error verifying account.');
              return;
          }
      });
      res.status(200).send('Account verification successful!');
    }).catch(error => {
      res.status(400).send('Account verification failed');
    });
};

// encodes new token for a user
// based off CS52 passport auth guide http://cs52.me/assignments/hw5p2/ (URL subject to change)
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ user: user.id, iat: timestamp }, process.env.API_SECRET);
}

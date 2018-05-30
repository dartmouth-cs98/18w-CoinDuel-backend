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
import request from 'request';

// password encryption
dotenv.config({ silent: true });

const uuidv4 = require('uuid/v4');
const mailgun = require('mailgun-js')({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN, retry: 3});

// generate token upon sign in
export const signin = (req, res) => {
  const username = req.body.username;
  User.findOne({ username })
  .then(myUser => {

    // check for errors
    if (!myUser) res.status(404).send('error-username');
    else if (!myUser.verified) res.status(423).send('error-verify')

    // generate and send back new token
    else res.status(200).send({ token: tokenForUser(myUser), user: myUser });
  })
  .catch(err => {
    res.status(500).send('error-else');
  });
};

// signup user
export const signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;

  // ensure all fields exist
  if (!email || !password || !username) {
    return res.status(422).json({'errTitle': 'Oops! Our server seems to running into some trouble.', 'errBody': 'Please wait a moment and try again.'});
  }

  // check database for username
  User.findOne({
      "username": username
    })
    .then((user) => {

      // username already exists in database
      if (user) {
        res.status(422).json({'errTitle':'We\'re sorry! This username has already been taken.', 'errBody':'Please enter a new username and try again.'})
        return;

      // instantiate user and signup
      } else {
        const newUser = new User();
        newUser.email = email;
        newUser.password = password;
        newUser.username = username;
        newUser.profile_url = req.body.profile_url;
        newUser.coinBalance = 30;
        newUser.verified = false;
        newUser.verificationId = uuidv4();

        // proceed with verification email
        newUser.save()
        .then(result => {
          var email_html = req.app.locals.resources.mailgun_email1 + username + req.app.locals.resources.mailgun_email2 + newUser.verificationId + req.app.locals.resources.mailgun_email3;
          var data = {
            from: 'CoinDuel Mailer <noreply@coinduel.co>',
            to: email,
            subject: 'CoinDuel Email Verification',
            html: email_html,
          };

          // send email through mailgun
          mailgun.messages().send(data, function (error, body) {
            if (!error) {
              console.log("Verification email sent");

              // register user on OneSignal for push notifications
              var reqBody = { app_id: process.env.ONESIGNAL_APP_ID, device_type: 0, language: 'en',  };
  						var params = { body: reqBody, json: true, url: 'https://onesignal.com/api/v1/players' };
  						request.post(params, (oneSignal_error, oneSignal_response, oneSignal_body) => {
                  if (!oneSignal_error) {
                    User.findOneAndUpdate({ email: email }, { $set: { oneSignalId: oneSignal_body['id'] } });
                  } else {
                    console.log("Error registering user on OneSignal – ${" + oneSignal_error + "}");
                  }
              });

              res.status(200).send({ token: tokenForUser(newUser), user: newUser });

            // unable to send user a verification email
            } else {
              newUser.remove();
              console.log("Error sending verification email – ${" + error + "}");
              res.status(422).json({'errTitle': 'Oops! We were unable to send you a verification email.', 'errBody': 'Please check your email address and try again.'});
            }
          });
        })
        .catch(err => {

          // error saving user in database
          if (newUser) newUser.remove();
          console.log(err.name);
          console.log(err.message);

          // catch duplicate email error
          if (err.message.startsWith('E11000')) {
            res.status(422).json({'errTitle': 'Hmm, it seems this email address belongs to another user.', 'errBody': 'Please use another email address.'});
          } else {
            res.status(422).json({'errTitle': 'Oops! Our server seems to running into some trouble.', 'errBody': 'Please wait a moment and try again.'});
          }
        });
      }
    })
    .catch(err => {
      // error querying database for username
      res.status(422).json({'errTitle': 'Oops! Our server seems to running into some trouble.--', 'errBody': 'Please wait a moment and try again.'});
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
        message: 'User successfully deleted!'
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
      result.update({ $set: { verified: true } }, (updateErr, updateRes) => {
        if (updateErr || !updateRes) {
          res.status(400).send('Error verifying account.');
          return;
        }
      });
      console.log(__dirname);
      res.status(200).sendFile(path.join(__dirname+'/verified.html'));
    }).catch(error => {
      res.status(400).send('Email verification failed.');
    });
};

// encodes new token for a user
// based off CS52 passport auth guide http://cs52.me/assignments/hw5p2/ (URL subject to change)
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ user: user.id, iat: timestamp }, process.env.API_SECRET);
}

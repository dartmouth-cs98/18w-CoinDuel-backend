/*
 * notifications.js
 *
 * API endpoints to deal with push notifications through OneSignal
 * May 29 2018
 * Kooshul Jhaveri
 */

import User from '../models/user.js';
import Game from '../models/game.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt-nodejs';

dotenv.config({ silent: true });

const OneSignal = require('onesignal-node');
const OneSignalClient = new OneSignal.Client({
    userAuthKey: process.env.ONESIGNAL_USER_AUTH_KEY,
    app: { appAuthKey: process.env.ONESIGNAL_API_KEY, appId: process.env.ONESIGNAL_APP_ID }
});

// schedule OneSignal pre-game notifications
export const preGameNotify = (req, res) => {
  const schedulerTokenHash = req.body.schedulerTokenHash;

  // compare scheduler token hash with stored token
  var isErr = false;
  bcrypt.compare(process.env.SCHEDULER_TOKEN, schedulerTokenHash, (err, isMatch) => {
    if (err) {
      res.status(422).send('Unable to verify token.');
      isErr = true;
    }

    // raise error if no match
    else if (!isMatch) {
      res.status(422).send('Invalid token.');
      isErr = true;
    }
  });

  // exit if error was raised
  if (isErr) {
    return;
  }

  // query for a game starting soon
  var start_date = new Date();
  start_date.setMinutes(start_date.getMinutes() + 5);
  Game.find({
    start_date: {
      $lte: start_date,
    }
  })
  .sort({start_date: -1})
  .limit(1)
  .then((result) => {
    // if such a game exists, schedule a pre-game notification through OneSignal
    if (result.length > 0) {
      var message = 'There\'s a new CoinDuel game starting NOW – open the app & start trading!';
      var preGameNotif = new OneSignal.Notification({ contents: { en: message } });

      // push notification for all users
      preGameNotif.setIncludedSegments(['All']);

      // OneSignal API call to send notification
      OneSignalClient.sendNotification(preGameNotif, function (err, httpResponse, data) {
        if (err) {
          res.status(422).send('Error sending pre-game notification:', err);
          return;
        } else {
          console.log('Pre-game notification successfully sent;', data, httpResponse.statusCode);
          res.status(200).send('Pre-game notification successfully sent.');
          return;
        }
      });
    } else {
      res.status(204).send('No upcoming game to send notifications for.');
      return;
    }
  })
  .catch((error) => {
    res.status(500).json({ error });
  });
};

export const postGameNotify = (req, res) => {
  const schedulerTokenHash = req.body.schedulerTokenHash;

  // compare scheduler token hash with stored token
  var isErr = false;
  bcrypt.compare(process.env.SCHEDULER_TOKEN, schedulerTokenHash, (err, isMatch) => {
    if (err) {
      res.status(422).send('Unable to verify token.');
      isErr = true;
    }

    // raise error if no match
    else if (!isMatch) {
      res.status(422).send('Invalid token.');
      isErr = true;
    }
  });

  // exit if error was raised
  if (isErr) {
    return;
  }

  // query for a game that just ended
  var finish_date = new Date();
  Game.find({
    finish_date: {
      $lte: finish_date,
    }
  })
  .sort({finish_date: -1})
  .limit(1)
  .then((result) => {
    // if such a game exists, schedule a post-game notification through OneSignal
    if (result.length > 0) {
      var message = 'A CoinDuel game just ended – come see how you stacked up against the competition!';
      var postGameNotif = new OneSignal.Notification({ contents: { en: message } });

      // push notification for all users
      postGameNotif.setIncludedSegments(['All']);

      // OneSignal API call to send notification
      OneSignalClient.sendNotification(postGameNotif, function (err, httpResponse, data) {
        if (err) {
          res.status(422).send('Error sending post-game notification:', err);
          return;
        } else {
          console.log('Post-game notification successfully sent;', data, httpResponse.statusCode);
          res.status(200).send('Post-game notification successfully sent.');
          return;
        }
      });
    } else {
      res.status(204).send('No game finishing soon to send notifications for.');
      return;
    }
  })
  .catch((error) => {
    res.status(500).json({ error });
  });
};

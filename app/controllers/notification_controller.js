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

  // query for a game starting in the next hour
  var current_date = new Date();
  var start_max = new Date();
  start_max.setMinutes(start_max.getMinutes() + 60);
  Game.find({
    start_date: {
      $gt: current_date,
      $lt: start_max
    }
  })
  .sort('start_date').limit(1)
  .then((result) => {
    // if such a game exists, schedule a pre-game notification through OneSignal
    if (result.length > 0) {
      var start_date = new Date(result[0]['start_date']);
      var hours = start_date.getHours() % 12 || 0;
      var minutes = start_date.getMinutes();
      var padding = minutes < 10 ? '0' : '';
      var period = start_date.getHours() < 12 ? 'am' : 'pm';

      var message = 'There\'s a new CoinDuel game starting at ' + hours + ':' + padding + minutes + period + ' – get ready to start trading!';
      var preGameNotif = new OneSignal.Notification({ contents: { en: message } });

      // push notification for all users
      preGameNotif.setIncludedSegments(['All']);

      // want to send notification 5 min before game start
      var notifDate = new Date(result[0]['start_date']);
      notifDate.setMinutes(notifDate.getMinutes() - 5);

      // format like "Sept 24 2015 14:00:00 GMT-0700"
      var notifStr = notifDate.toUTCString().split(' ');
      notifStr = notifStr[2] + ' ' + notifStr[1] + ' ' + notifStr[3] + ' ' + notifStr[4] + ' ' + notifStr[5];

      // schedule for delivery
      preGameNotif.setParameter('send_after', notifStr);

      // OneSignal API call to send notification
      OneSignalClient.sendNotification(preGameNotif, function (err, httpResponse, data) {
        if (err) {
          res.status(422).send('Error sending pre-game notification:', err);
          return;
        } else {
          console.log('Pre-game notification successfully sent;', data, httpResponse.statusCode);
          res.status(httpResponse.statusCode).send(data);
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

  // query for a game ending in the next hour
  var current_date = new Date();
  var finish_max = new Date();
  finish_max.setMinutes(finish_max.getMinutes() + 60);
  Game.find({
    finish_date: {
      $gte: current_date,
      $lte: finish_max,
    }
  })
  .sort('finish_date')
  .limit(1)
  .then((result) => {
    // if such a game exists, schedule a post-game notification through OneSignal
    if (result.length > 0) {
      var message = 'A CoinDuel game just ended – come check out how you stacked up against the competition!';
      var postGameNotif = new OneSignal.Notification({ contents: { en: message } });

      // push notification for all users
      postGameNotif.setIncludedSegments(['All']);

      // want to send notification 1 min after game ends
      var notifDate = new Date(result[0]['finish_date']);
      notifDate.setMinutes(notifDate.getMinutes() + 1);

      // format like "Sept 24 2015 14:00:00 GMT-0700"
      var notifStr = notifDate.toUTCString().split(' ');
      notifStr = notifStr[2] + ' ' + notifStr[1] + ' ' + notifStr[3] + ' ' + notifStr[4] + ' ' + notifStr[5];

      // schedule for delivery
      postGameNotif.setParameter('send_after', notifStr);

      // OneSignal API call to send notification
      OneSignalClient.sendNotification(postGameNotif, function (err, httpResponse, data) {
        if (err) {
          res.status(422).send('Error sending post-game notification:', err);
          return;
        } else {
          console.log('Post-game notification successfully sent;', data, httpResponse.statusCode);
          res.status(httpResponse.statusCode).send(data);
          return;
        }
      });
    } else {
      res.status(204).send('No game finishing soon enough to send notifications for.');
      return;
    }
  })
  .catch((error) => {
    res.status(500).json({ error });
  });
};

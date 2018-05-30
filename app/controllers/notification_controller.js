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
  var start_date = new Date();
  start_date.setMinutes(start_date.getMinutes() + 60);
  Game.find({
    start_date: {
      $gt: current_date,
      $lt: start_date
    }
  })
  .sort('start_date').limit(1)
  .then((result) => {
    // if such a game exists, schedule a pre-game notification through OneSignal
    if (result.length > 0) {
      start_date = new Date(result[0]['start_date']);
      start_date = new Date(start_date.getTime());
      time_str = start_date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      console.log(start_date);
      console.log(time_str);
      var message = 'There\'s a new CoinDuel game starting at ' + time_str + ' – get ready to start trading!';
      //var message = 'There\'s a new CoinDuel game starting – get ready to start trading!';
      var preGameNotif = new OneSignal.Notification({ contents: { en: message } });

      // push notification for all users
      preGameNotif.setIncludedSegments(['All']);

      // want to send notification 5 min before game start
      // var notifDate = new Date(result.start_date);
      // notifDate.setMinutes(notifDate.getMinutes() - 5);
      // time_str = notifDate.toUTCString().split(' ');
      // time_str = time_str[2] + ' ' + time_str[1] + ' ' + time_str[3] + ' ' + time_str[4] + ' ' + time_str[5];
      // preGameNotif.setParameter('send_after', time_str);
      // OneSignal API call to send notification
      OneSignalClient.sendNotification(preGameNotif, function (err2, httpResponse, data) {
        if (err2) {
          res.status(422).send('Error sending pre-game notification:', err);
          return;
        } else {
          console.log('Pre-game notification successfully sent;', data, httpResponse.statusCode);
          res.status(httpResponse.statusCode).send(data);
        }
      });
    } else {
      res.status(204).send('No upcoming game to send notifications for.');
      return;
    }
    console.log('end');
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
  var finish_date = new Date();
  start_date.setMinutes(start_date.getMinutes() + 60);
  Game.find({
    finish_date: {
      $gte: current_date,
      $lte: finish_date,
    }
  })
  .sort('finish_date')
  .limit(1)
  .then((result) => {
    // if such a game exists, schedule a pre-game notification through OneSignal
    if (result) {
      message = 'A CoinDuel game just ended – come see how you stacked up against the competition!';
      var preGameNotif = new OneSignal.Notification({ contents: { en: message } });

      // push notification for all users
      preGameNotif.setIncludedSegments(['All']);

      // want to send notification 1 min after game end
      var notifDate = new Date(result.finish_date);
      notifDate.setMinutes(notifDate.getMinutes() + 1);
      time_str = notifDate.toUTCString().split(' ');
      time_str = time_str[2] + ' ' + time_str[1] + ' ' + time_str[3] + ' ' + time_str[4] + ' ' + time_str[5];
      preGameNotif.setParameter('send_after', time_str);

      // OneSignal API call to send notification
      OneSignalClient.sendNotification(preGameNotif, function (err, httpResponse, data) {
        if (err) {
          res.status(422).send('Error sending post-game notification:', err);
          return;
        } else {
          console.log('Post-game notification successfully sent;', data, httpResponse.statusCode);
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

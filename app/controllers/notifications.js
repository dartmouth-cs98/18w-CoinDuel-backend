/*
 * notifications.js
 *
 * API endpoints to deal with push notifications through OneSignal
 * May 29 2018
 * Kooshul Jhaveri
 */

import User from '../models/user.js';
import Game from '../models/game.js';

// delete a user, used for account deletion
export const preGameNotifications = (req, res) => {
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

  var current_date = new Date();
  var start_date = new Date();
	start_date.setMinutes(start_date.getMinutes() + 15);
  Game.find({
			start_date: {
				$gte: current_date,
        $lte: start_date,
			}
		})
		.sort('start_date')
		.limit(1)
		.then((result) => {
      if (result) {

      } else {
        res.status(204).send('No game to send notifications for.');
        return;
      }
		})
		.catch((error) => {
			res.status(500).json({ error });
		});
};

export const postGameNotifications = (req, res) => {
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






};

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

	// compare schedular token hash with stored token
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

	// bail if error was raised
	if (isErr) {
		return;
	}





};

export const postGameNotifications = (req, res) => {
  const schedulerTokenHash = req.body.schedulerTokenHash;

	// compare schedular token hash with stored token
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

	// bail if error was raised
	if (isErr) {
		return;
	}






};

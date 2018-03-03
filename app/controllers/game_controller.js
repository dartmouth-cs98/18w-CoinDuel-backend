/*
 * game_controller.js
 *
 * API endpoints to deal with CRUD operations for games and game entries
 * Feb 12 2018
 * Kooshul Jhaveri
 */

import User from '../models/user.js';
import Game from '../models/game.js';
import GameEntry from '../models/gameentry.js';

// returns most recent game
// // @param req, ex. { }
export const getLatestGame = (req, res) => {
	var date = Date.now()

	Game.find({
		finish_date: {$gt: date}
	})
	.sort('finish_date')
	.limit(1)
	.then((result) => {
		res.json(result);
	})
	.catch((error) => {
		res.status(500).json({ error });
	});
};

export const createGame = (req, res) => {
	GameEntry.findOneAndUpdate(
		{ gameId: req.params.gameId, userId: req.params.userId },
		{ $set: { gameId: req.params.gameId, userId: req.params.userId, choices: req.body.choices, last_updated: Date.now() }},
		{ upsert: true, new: true, setDefaultsOnInsert: true })
	.then((result) => {
		if (result) {
			res.json(result);
		} else {
			res.status(422).send('Unsuccessful create/update');
		}
	})
	.catch((error) => {
		res.status(422).send('Unsuccessful create/update');
	});
};

// gets entry specified by game and user ids
// // @param req, ex. { }
export const getEntry = (req, res) => {
	GameEntry.findOne({ gameId: req.params.gameId, userId: req.params.userId })
	.then((result) => {
		if (result) {
			res.json(result);
		} else {
			res.status(422).send('No entry found for this user');
		}
	})
	.catch((error) => {
		res.status(422).send('No entry found for this user');
	});
};

// updates entry specified by game and user ids (creates a new entry if one doesn't already exist)
export const createAndUpdateEntry = (req, res) => {
	GameEntry.findOneAndUpdate(
		{ gameId: req.params.gameId, userId: req.params.userId },
		{ $set: { gameId: req.params.gameId, userId: req.params.userId, choices: req.body.choices, last_updated: Date.now() }},
		{ upsert: true, new: true, setDefaultsOnInsert: true })
	.then((result) => {
		if (result) {
			res.json(result);
		} else {
			res.status(422).send('Unsuccessful create/update');
		}
	})
	.catch((error) => {
		res.status(422).send('Unsuccessful create/update');
	});
};

// deletes entry specified by game and user ids
// @param req, ex. { }
export const deleteEntry = (req, res) => {
  GameEntry.findOneAndRemove({ gameId: req.params.gameId, userId: req.params.userId })
  .then((result) => {
  	if (result) {
    	res.json(result);
    } else {
    	res.status(422).send('No entry found for this user');
    }
  })
  .catch((error) => {
    res.status(422).send('No entry found for this user');
  });
};

/*
 * Create new game for next week.
 * @param req, ex. { }
 */
export const createNextGame = (req, res) => {
	// bail if today isn't friday
	var today = new Date();
	if (today.getDay() != 5) {
		res.status(422).send('ERROR: new games can only be created on Fridays')
		return;
	}

		// get two monday's from now at 10:00PM UTC (5:00PM EST)
	var startDate = new Date();
	startDate.setHours(17, 0, 0, 0);
	startDate.setDate(startDate.getDate() + 10);

	// get two friday's from now at 2:00PM UTC (9:00AM EST)
	var endDate = new Date();
	endDate.setHours(9, 0, 0, 0);
	endDate.setDate(endDate.getDate() + 14);

	// create choices
	const tickers = req.app.locals.resources.tickers;
	var tickerChoices = [];
	for (var prop in tickers) {
	  if (tickers.hasOwnProperty(prop)) {
	    tickerChoices.push(prop);
	  }
	}

	// randomly select 5 tickers
	var choices = [];
	var flags = {};
	while (choices.length < 5) {
		let index = tickerChoices.length * Math.random() << 0;
		if (!(index in flags)) choices.push({"name":tickerChoices[index], "value":null});
		flags[index] = true;
	}

	// create db entry for game in 2 weeks (next game should already be created)
	Game.create({ start_date: startDate, finish_date: endDate, coins: choices }, (err, res) => {
		if (err || !res) {
			res.status(500).send('Unable to create db entry for new game');
			return;
		}
	});

	// we made it
	res.status(200).send('successful');
};

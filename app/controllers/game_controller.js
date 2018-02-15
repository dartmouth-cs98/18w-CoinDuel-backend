import User from '../models/user.js';
import Game from '../models/game.js';
import GameEntry from '../models/gameentry.js';

// returns most recent game
// // @param req, ex. { }
export const getLatestGame = (req, res) => {
	Game.find({})
	.sort('-start_date')
	.limit(1)
	.then((result) => {
		res.json(result);
	})
	.catch((error) => {
		res.status(500).json({ error });
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
// @param req, ex. { "choices": [["BTC", 2], ["ETH", 3], ["XRP", 2], ["BCH", 2], ["LTC", 1]] }
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

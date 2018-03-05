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

// for calls to CoinMarketCap
const getJSON = require('get-json');

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
	GameEntry.find({ gameId: req.params.gameId, userId: req.params.userId }, (error, result) => {

		// entry does not already exist
		if (error || !result || result.length == 0) {
			var totalCapcoin = 0;
			var userBalance = 0;

			// check user's capcoin balance
			User.findOne({ _id: req.params.userId }, (error, result) => {
				if (error || !result) {
					res.status(422).send('user does not exist');
					return;
				}

				// ensure user won't go negative
				userBalance = result.coinBalance;
				req.body.choices.forEach(choice => totalCapcoin += choice.allocation);
				if (totalCapcoin > userBalance) {
					res.status(200).json({'error': 'insufficient funds'});
					return;
				}

				// create new game entry
				GameEntry.findOneAndUpdate(
					{ gameId: req.params.gameId, userId: req.params.userId },
					{ $set: { gameId: req.params.gameId, userId: req.params.userId, choices: req.body.choices, last_updated: Date.now() }},
					{ upsert: true, new: true, setDefaultsOnInsert: true }, (newError, newResult) => {
					if (newError || !newResult) {
						res.status(500).send('unable to create game entry');
						return;
					}

					// withdraw capcoin from user's account
					totalCapcoin *= -1;
					User.findOneAndUpdate(
						{ _id: req.params.userId },
						{ $inc: { coinBalance: totalCapcoin }},
						(userError, userResult) => {
						if (userError || !userResult) {
							res.status(500).send('unable to update user capcoin balance');
							return;
						}

						// we made it
						res.status(200).send(newResult);
					});
				});
			});
			return;
		}

		// update entry
		GameEntry.findOneAndUpdate(
			{ gameId: req.params.gameId, userId: req.params.userId },
			{ $set: { gameId: req.params.gameId, userId: req.params.userId, choices: req.body.choices, last_updated: Date.now() } },
			{ upsert: true, new: true, setDefaultsOnInsert: true }, (upError, upResult) => {
			if (upError || !upResult) res.status(500).send('unable to update game entry');
			else res.status(200).send(upResult);
		});
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

	/****************************************
	**	COMMENTING OUT FOR CS98 GALA DEMO  **
	****************************************/

	// var today = new Date();
	// if (today.getDay() != 5) {
	// 	res.status(422).send('ERROR: new games can only be created on Fridays')
	// 	return;
	// }

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

/*
 * Start of each game - set initial prices for coins and take capcoin from user.
 * @param req, ex. { }
 */
export const initializeGame = (req, res) => {
	// bail if today isn't monday

	/****************************************
	**	COMMENTING OUT FOR CS98 GALA DEMO  **
	****************************************/

	// var today = new Date();
	// if (today.getDay() != 1) {
	// 	res.status(422).send('ERROR: initial prices can only be set at the start of games on Mondays')
	// 	return;
	// }

	// set initial coin prices for game
  Game.find({ finish_date: {$gt: Date.now()},  start_date: {$lt: Date.now()}}, (error, result) => {
    if (error || !result) {
      res.status(422).send('No game currently available');
      return;
    }
		var game = result[0];

    // save tickers in obj
    var tickerFlags = {};
    game.coins.forEach(coin => tickerFlags[coin.name] = true);

    // get current prices of coins
    var currentPrices = {};
    getJSON('https://api.coinmarketcap.com/v1/ticker/?limit=0', (subErr, cryptos) => {
      if (subErr || !cryptos) {
        res.status(422).send('Unable to retrieve prices - please check http://api.coinmarketcap.com/. ERROR: ' + subErr);
        return;
      }

      // store game's current coin prices
      cryptos.forEach(crypto => {
        if (tickerFlags[crypto.symbol]) currentPrices[crypto.symbol] = parseFloat(crypto.price_usd);
      });

			// change prices in coins array
			var coinChoices = [];
			game.coins.forEach(coin => coinChoices.push({"name": coin.name, "value": currentPrices[coin.name]}));

      // update coins array
			var updateGame = true;
      Game.findOneAndUpdate({ _id: game._id }, { $set: { coins: coinChoices }}, (err, res) => {
					if (err) {
						console.log('unable to set initial prices for game ' + game._id);
						updateGame = false;
					}
			});
			if (!updateGame) res.status(500).send('unable to set initial prices for game ' + game._id);

			// we made it
      else res.status(200).send('successful');
    });
  });
};

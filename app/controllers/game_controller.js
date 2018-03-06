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
				req.body.choices.forEach(choice => totalCapcoin += parseFloat(choice.allocation));
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

	// get two monday's from now at 10:00:00PM UTC (5:00:00PM EST)
	var startDate = new Date();
	startDate.setMinutes(startDate.getMinutes() + 30);
	// startDate.setHours(17, 0, 0, 0);
	// startDate.setDate(startDate.getDate() + 10);

	// get two friday's from now at 2:00:10PM UTC (9:00:10AM EST)
	var endDate = new Date();
	endDate.setHours(endDate.getHours() + 1);
	// endDate.setHours(9, 0, 10, 0);
	// endDate.setDate(endDate.getDate() + 14);

	// create choices
	const tickers = req.app.locals.resources.tickers;
	var tickerChoices = [];
	for (var prop in tickers) {
	  if (tickers.hasOwnProperty(prop)) {
	    tickerChoices.push(prop);
	  }
	}

	// // randomly select 5 tickers
	// var choices = [];
	// var flags = {};
	// while (choices.length < 5) {
	// 	let index = tickerChoices.length * Math.random() << 0;
	// 	if (!(index in flags)) choices.push({"name":tickerChoices[index], "startPrice":null});
	// 	flags[index] = true;
	// }

	// default choices
	var choices = [
		{"name": "BTC", "startPrice": null, "endPrice":null},
		{"name": "ETH", "startPrice": null, "endPrice":null},
		{"name": "XRP", "startPrice": null, "endPrice":null},
		{"name": "BCH", "startPrice": null, "endPrice":null},
		{"name": "LTC", "startPrice": null, "endPrice":null}
	];

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
 * End of each game - set end prices for coins and give capcoin back to user.
 * @param req, ex. { }
 */
export const endGame = (req, res) => {
	// bail if today isn't friday

	/****************************************
	**	COMMENTING OUT FOR CS98 GALA DEMO  **
	****************************************/

	// var today = new Date();
	// if (today.getDay() != 5) {
	// 	res.status(422).send('ERROR: games can only be ended on Fridays')
	// 	return;
	// }

	// set initial coin prices for game
	var date = Date.now();
	Game.find({ finish_date: {$lt: date}})
	.sort('-finish_date').exec((error, result) => {
    if (error || !result || result.length == 0) {
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
			game.coins.forEach(coin => coinChoices.push({"name": coin.name, "startPrice": coin.startPrice, "endPrice":currentPrices[coin.name]}));

      // update coins array
			var updateGame = true;
      Game.findOneAndUpdate({ _id: game._id }, { $set: { coins: coinChoices }}, (updateErr, updateRes) => {
					if (updateErr) {
						res.status(500).send('unable to set end prices for game ' + game._id);
						return;
					}

					// give capcoin winnings back to all users
					var updateError = 'none';
					GameEntry.find({ gameId: game._id }, (entryErr, entryRes) => {
						entryRes.forEach(entry => {
							var winnings = entry.coin_balance;
							User.findOneAndUpdate({ _id: entry.userId }, { $inc: { coinBalance: winnings }}, (winningsErr, winningsRes) => {
									updateError = winningsErr ? 'unable to update capcoin balance for user \'' + entry.userId + '\'. ERROR: ' + err : 'none';
							});
						});
					})

					// send back errors if any
					if (updateError != 'none') {
						res.status(500).send(updateError);
						return
					}

					// we made it
					res.status(200).send('successful');
			});
    });
  });
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
    if (error || !result || result.length == 0) {
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
			game.coins.forEach(coin => coinChoices.push({"name": coin.name, "startPrice": currentPrices[coin.name], "endPrice":null}));

      // update coins array
			var updateGameError = 'none';
      Game.findOneAndUpdate({ _id: game._id }, { $set: { coins: coinChoices }}, (err, res) => {
					if (err) {
						updateGameError = 'unable to set initial prices for game ' + game._id;
						return;
					}
			});
			if (updateGameError != 'none') res.status(500).send(updateGameError);

			// we made it
      else res.status(200).send('successful');
    });
  });
};

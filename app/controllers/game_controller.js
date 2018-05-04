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
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();

// for calls to CryptoCompare/CoinMarketCap
const getJSON = require('get-json');

export const getCapcoinPerformanceForGame = (req, res) => {
	var data = [];
	var performanceArray = [];
	var initialAllocation;
	var startTime;
	var endTime;
	var durationOfGameMinutes;
	var durationOfGameSeconds;

	Game.findOne({
		_id: req.params.gameId
	}, (error, game) => {
		if (error || !game){
			res.status(500).send('unable to get game performance, no game found');
			return
		}
		var gameCoins = game.coins
		//get the duration of a game to calculate price history for
		startTime = game.start_date
		endTime = game.finish_date
		durationOfGameSeconds = parseInt((endTime-startTime)/1000); // Difference in milliseconds.
		durationOfGameMinutes = durationOfGameSeconds/60;

		// initialize data array which will be the end product
		for(var i = 0; i < durationOfGameMinutes+1; i++) {
		    data.push({
					"time": 0,
					"unixTime": 0,
					"capCoin": 0
				});
		}


		//find game entry to get allocations for each coin and calculate return for each minute.
		GameEntry.findOne({
			userId: req.params.userId,
			gameId: req.params.gameId
		}, (error, entry) => {
			if (error || !entry){
				res.status(500).send('Unable to find entry for user');
				return
			}
			var progress = 0;
			var numberAllocated = 0;
			//add check if game hasn't started yet. although this endpoint should only be called
			// if a game has ended or is in progress
			var amountCapCoinAllocated = 0;
			entry.choices.forEach(coin => {
				console.log(progress);

				var capcoinAllocation = coin.allocation
				// only get price data if coin has been allocated
				if (capcoinAllocation > 0) {
					numberAllocated += 1;
					amountCapCoinAllocated = amountCapCoinAllocated + capcoinAllocation;
					console.log(amountCapCoinAllocated);
					var startingPrice;
					gameCoins.forEach(gameCoin => {
						if(coin.symbol == gameCoin.name){
							startingPrice = gameCoin.startPrice;
							console.log(`Allocation for ${coin.symbol} is ${capcoinAllocation} at a starting price of ${startingPrice}`);
						}
					});
					//SOURCE: https://www.learnhowtoprogram.com/javascript/asynchrony-and-apis-in-javascript/making-api-calls-with-javascript

					var url = `https://min-api.cryptocompare.com/data/histominute?fsym=${coin.symbol}&tsym=USD&limit=${durationOfGameMinutes}`;
					console.log(url);
					var request = new XMLHttpRequest();

					request.open("GET", url, true);
					//networking call.
					request.onload = function () {
						console.log("herer");
						var x = 0;
						var response = JSON.parse(this.responseText);
						response.Data.forEach(price => {
							var currentPrice = price['high'];
							var percentChange = ( (currentPrice - startingPrice) / startingPrice )
							var capcoinChange = capcoinAllocation * percentChange

							data[x].time = x;
							data[x].unixTime = price['time'];
							data[x].capCoin += capcoinChange;

							x = x + 1;
							//Calculate capcoin change for each minute/time interval
						});
						console.log(data);
						// res.status(200).send(data);
						progress = progress + 1;
						if (progress == numberAllocated) {
							// add final capcoin changes to initial amount allocated for entry
							for(var i = 0; i < durationOfGameMinutes+1; i++) {
								data[i].capCoin += data[i].capCoin + amountCapCoinAllocated;
							}
							res.status(200).send(data);
						}
					};
					request.send();

				}
			});
		});
	});
}

// returns most recent game
// // @param req, ex. { }
export const getLatestGame = (req, res) => {
	var date = Date.now()
	Game.find({
			finish_date: {
				$gt: date
			}
		})
		.sort('finish_date')
		.limit(1)
		.then((result) => {
			res.json(result);
		})
		.catch((error) => {
			res.status(500).json({
				error
			});
		});
};

export const createGame = (req, res) => {
	GameEntry.findOneAndUpdate({
			gameId: req.params.gameId,
			userId: req.params.userId
		}, {
			$set: {
				gameId: req.params.gameId,
				userId: req.params.userId,
				choices: req.body.choices,
				last_updated: Date.now()
			}
		}, {
			upsert: true,
			new: true,
			setDefaultsOnInsert: true
		})
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
	GameEntry.findOne({
			gameId: req.params.gameId,
			userId: req.params.userId
		})
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
	GameEntry.find({
		gameId: req.params.gameId,
		userId: req.params.userId
	}, (error, result) => {

		// entry does not already exist
		if (error || !result || result.length == 0) {
			var totalCapcoin = 0;
			var userBalance = 0;

			// check user's capcoin balance
			User.findOne({
				_id: req.params.userId
			}, (error, result) => {
				if (error || !result) {
					res.status(422).send('user does not exist');
					return;
				}

				// ensure user won't go negative
				userBalance = result.coinBalance;
				req.body.choices.forEach(choice => totalCapcoin += parseFloat(choice.allocation));
				if (totalCapcoin > userBalance) {
					res.status(200).json({
						'error': 'insufficient funds'
					});
					return;
				}

				// create new game entry
				GameEntry.findOneAndUpdate({
					gameId: req.params.gameId,
					userId: req.params.userId
				}, {
					$set: {
						gameId: req.params.gameId,
						userId: req.params.userId,
						choices: req.body.choices,
						last_updated: Date.now()
					}
				}, {
					upsert: true,
					new: true,
					setDefaultsOnInsert: true
				}, (newError, newResult) => {
					if (newError || !newResult) {
						res.status(500).send('unable to create game entry');
						return;
					}

					// withdraw capcoin from user's account
					totalCapcoin *= -1;
					User.findOneAndUpdate({
							_id: req.params.userId
						}, {
							$inc: {
								coinBalance: totalCapcoin
							}
						},
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
		GameEntry.findOneAndUpdate({
			gameId: req.params.gameId,
			userId: req.params.userId
		}, {
			$set: {
				gameId: req.params.gameId,
				userId: req.params.userId,
				choices: req.body.choices,
				last_updated: Date.now()
			}
		}, {
			upsert: true,
			new: true,
			setDefaultsOnInsert: true
		}, (upError, upResult) => {
			if (upError || !upResult) res.status(500).send('unable to update game entry');
			else res.status(200).send(upResult);
		});
	});
};

// deletes entry specified by game and user ids
// @param req, ex. { }
export const deleteEntry = (req, res) => {
	GameEntry.findOneAndRemove({
			gameId: req.params.gameId,
			userId: req.params.userId
		})
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

	// start datetime in 30 mins
	var startDate = new Date();
	startDate.setMinutes(startDate.getMinutes() + 30);

	// end datetime in 1 hour
	var endDate = new Date();
	endDate.setMinutes(endDate.getMinutes() + 60);

	// contact CoinMarketCap for top 50 coins by market cap
	var flags = {};
	var choices = [];
  getJSON('https://api.coinmarketcap.com/v2/ticker/?limit=50', (error, cryptos) => {
		if (error || !cryptos) {
			res.status(500).send('Unable to retrieve coins - please check http://api.coinmarketcap.com/. Error: ' + error);
			return;
		}

		// put top 7 coins by market cap in the game
		const mcChoices = req.app.locals.resources.mcChoices;

		for (var obj in cryptos.data) {
			if (parseInt(cryptos.data[obj].rank) <= mcChoices) {
				choices.push({
					"name": cryptos.data[obj].symbol,
					"startPrice": null,
					"endPrice": null
				});
				flags[parseInt(cryptos.data[obj].rank)] = true;
			}
		}

		var numCoins = Object.keys(cryptos.data).length

		// randomly select 3 tickers
		const randChoices = req.app.locals.resources.randomChoices;
		while (choices.length < randChoices + mcChoices) {
			let randomRank = numCoins * Math.random() << 0;
			if (!(randomRank in flags)) {
				for (var obj in cryptos.data) {
					if (parseInt(cryptos.data[obj].rank) == randomRank) {
						choices.push({
							"name": cryptos.data[obj].symbol,
							"startPrice": null,
							"endPrice": null
						});
						flags[randomRank] = true;
					}
				}
			}
		}

		console.log(choices);

		// // default choices
		// var choices = [
		// 	{"name": "BTC", "startPrice": null, "endPrice":null},
		// 	{"name": "ETH", "startPrice": null, "endPrice":null},
		// 	{"name": "XRP", "startPrice": null, "endPrice":null},
		// 	{"name": "BCH", "startPrice": null, "endPrice":null},
		// 	{"name": "LTC", "startPrice": null, "endPrice":null}
		// ];

		// create db entry for game in 2 weeks (next game should already be created)
		Game.create({ start_date: startDate, finish_date: endDate, coins: choices }, (err, result) => {
			if (err || !result) {
				res.status(500).send('Unable to create db entry for new game');
				return;
			}

			// we made it
			res.status(200).send('successful');
		});
	});
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
	Game.find({
			finish_date: {
				$lt: date
			}
		})
		.sort('-finish_date').exec((error, result) => {
			if (error || !result || result.length == 0) {
				res.status(422).send('No game currently available');
				return;
			}
			var game = result[0];

			// format string for API call
	    var tickerString = "";
	    for (var i = 0; i < game.coins.length; i++) {
	      if (i != game.coins.length - 1) {
	        tickerString = tickerString.concat(game.coins[i].name, ",");
	      } else {
	        tickerString = tickerString.concat(game.coins[i].name);
	      }
	    }

	    getJSON('https://min-api.cryptocompare.com/data/pricemulti?fsyms=' + tickerString + '&tsyms=USD', (err, prices) => {
	      if (err || !prices) {
	        res.status(422).send('Unable to retrieve price - please check https://min-api.cryptocompare.com. Error: ' + err);
	        return;
	      }

				// change prices in coins array
				var coinChoices = [];
				game.coins.forEach(coin => coinChoices.push({
					"name": coin.name,
					"startPrice": coin.startPrice,
					"endPrice": parseFloat(prices[coin.name]['USD'])
				}));

				// update coins array
				var updateGame = true;
				Game.findOneAndUpdate({
					_id: game._id
				}, {
					$set: {
						coins: coinChoices
					}
				}, (updateErr, updateRes) => {
					if (updateErr) {
						res.status(500).send('unable to set end prices for game ' + game._id);
						return;
					}

					// give capcoin winnings back to all users
					var updateError = 'none';
					GameEntry.find({
						gameId: game._id
					}, (entryErr, entryRes) => {
						entryRes.forEach(entry => {
							var winnings = entry.coin_balance > 0 ? entry.coin_balance : 0;
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
	Game.find({
		finish_date: {
			$gt: Date.now()
		},
		start_date: {
			$lt: Date.now()
		}
	}, (error, result) => {
		if (error || !result || result.length == 0) {
			res.status(422).send('No game currently available');
			return;
		}
		var game = result[0];

		// format string for API call
		var tickerString = "";
		for (var i = 0; i < game.coins.length; i++) {
			if (i != game.coins.length - 1) {
				tickerString = tickerString.concat(game.coins[i].name, ",");
			} else {
				tickerString = tickerString.concat(game.coins[i].name);
			}
		}

		// get current prices of coins
		getJSON('https://min-api.cryptocompare.com/data/pricemulti?fsyms=' + tickerString + '&tsyms=USD', (err, prices) => {
			if (err || !prices) {
				res.status(422).send('Unable to retrieve price - please check https://min-api.cryptocompare.com. Error: ' + err);
				return;
			}

			// change prices in coins array
			var coinChoices = [];
			game.coins.forEach(coin => coinChoices.push({
				"name": coin.name,
				"startPrice": parseFloat(prices[coin.name]['USD']),
				"endPrice": null
			}));

			// update coins array
			var updateGameError = '';
			Game.findOneAndUpdate({
				_id: game._id
			}, {
				$set: {
					coins: coinChoices
				}
			}, (err, res) => {
				if (err) {
					updateGameError = 'unable to set initial prices for game ' + game._id;
					return;
				}
			});
			if (updateGameError != '') res.status(500).send(updateGameError);

			// we made it
			else res.status(200).send('successful');
		});
	});
};

/*
 * game_controller.js
 *
 * API endpoints to deal with CRUD operations for games and game entries
 * Feb 12 2018
 * Kooshul Jhaveri
 */

import User from '../models/user.js';
import Game from '../models/game.js';
import Trade from '../models/trade.js';
import GameEntry from '../models/gameentry.js';
import request from 'request';
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();

// for hashing scheduler token
import bcrypt from 'bcrypt-nodejs';
import dotenv from 'dotenv';
dotenv.config({ silent: true });

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
			entry.currentChoices.forEach(coin => {
				var capcoinAllocation = coin.allocation

				// only get price data if coin has been allocated
				if (capcoinAllocation > 0) {
					numberAllocated += 1;
					amountCapCoinAllocated = amountCapCoinAllocated + capcoinAllocation;
					var startingPrice;
					gameCoins.forEach(gameCoin => {
						if(coin.symbol == gameCoin.name){
							startingPrice = gameCoin.startPrice;
						}
					});
					//SOURCE: https://www.learnhowtoprogram.com/javascript/asynchrony-and-apis-in-javascript/making-api-calls-with-javascript

					var url = `https://min-api.cryptocompare.com/data/histominute?fsym=${coin.symbol}&tsym=USD&limit=${durationOfGameMinutes}`;
					var request = new XMLHttpRequest();

					request.open("GET", url, true);
					//networking call.
					request.onload = function () {
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
				currentChoices: req.body.choices,
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
				res.send(422, 'Unsuccessful create/update');
			}
		})
		.catch((error) => {
			res.send(422, 'Unsuccessful create/update');
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

			if (!result) {
				res.status(422).send('No entry found for this user');
				return;
			}

			//get a ticketstring to get current prices for all coins.
			var choices = result.currentChoices
			var tickerString = "";
			for (var i = 0; i < choices.length; i++) {
				if (i != choices.length - 1) {
					tickerString = tickerString.concat(choices[i].symbol, ",");
				} else {
					tickerString = tickerString.concat(choices[i].symbol);
				}
			}
			// console.log(tickerString);

			// get current prices of coins
			getJSON('https://min-api.cryptocompare.com/data/pricemulti?fsyms=' + tickerString + '&tsyms=USD', (subErr, prices) => {
				if (subErr || !prices) {
					res.status(422).send('Unable to retrieve price - please check https://min-api.cryptocompare.com. Error: ' + subErr);
					return;
				}

				var count = 0
				// console.log(prices)
				for (var coin in prices) {
					if (choices[count].allocation > 0){

						var oldPrice = choices[count].price
						var currentPrice = prices[coin]['USD']


						var percentChange = 1
						if (currentPrice == 0){
							percentChange = 0
						} else if (currentPrice > oldPrice){
							percentChange = (1 + ((currentPrice - oldPrice)/(oldPrice)))
						} else if (currentPrice < oldPrice){
							percentChange = 1 - (((currentPrice - oldPrice)/(oldPrice)) * -1)
						}

						var oldAllocation = choices[count].allocation
						choices[count].price = currentPrice
						choices[count].allocation = (oldAllocation * percentChange)
					}
					count = count + 1
				}
				// //update coinBalance
				var newCoinBalance = result.unallocated_capcoin
				choices.forEach(choice => {
					newCoinBalance = newCoinBalance + choice.allocation
				});

				// update entry
				GameEntry.findOneAndUpdate({
					gameId: req.params.gameId,
					userId: req.params.userId
				}, {
					$set: {
						gameId: req.params.gameId,
						userId: req.params.userId,
						coin_balance: newCoinBalance,
						currentChoices: choices,
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
					} else {
						res.json(result);
					}
				});
			});
		})
		.catch((error) => {
			console.log(error)
			res.status(422).send('No entry found for this user');
		});
};

function calc(theform) {
    var num = theform.original.value, rounded = theform.rounded
    var with2Decimals = num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
    rounded.value = with2Decimals
}

// updates entry specified by game and user ids (creates a new entry if one doesn't already exist)
export const createAndUpdateEntry = (req, res) => {

	// choices[0].price = 10
	GameEntry.find({
		gameId: req.params.gameId,
		userId: req.params.userId
	}, (error, result) => {
		var choices = req.body.choices
		console.log("choices from frontend!!!")
		console.log(choices)

		// entry does not already exist
		if (error || !result || result.length == 0) {
			var totalCapcoin = 0;
			var userBalance = 0;

			// check user's capcoin balance
			User.findOne({
				_id: req.params.userId
			}, (error, user_result) => {
				if (error || !user_result) {
					res.status(422).send('user does not exist');
					return;
				}

				// ensure user won't go negative
				userBalance = user_result.coinBalance;
				choices.forEach(choice => totalCapcoin += parseFloat(choice.allocation));
				if (totalCapcoin > userBalance) {
					res.status(200).json({
						'error': 'insufficient funds'
					});
					return;
				} else if (totalCapcoin > 10) {
					res.status(200).json({
						'error': 'over capcoin limit for game'
					});
					return;
				}

				var unallocated = 10 - totalCapcoin
				// console.log(choices.length)
				var tickerString = "";
		    for (var i = 0; i < choices.length; i++) {
		      if (i != choices.length - 1) {
		        tickerString = tickerString.concat(choices[i].symbol, ",");
		      } else {
		        tickerString = tickerString.concat(choices[i].symbol);
		      }
		    }
				// console.log(tickerString);
				// get current prices of coins
		    getJSON('https://min-api.cryptocompare.com/data/pricemulti?fsyms=' + tickerString + '&tsyms=USD', (subErr, prices) => {
		      if (subErr || !prices) {
		        res.status(422).send('Unable to retrieve price - please check https://min-api.cryptocompare.com. Error: ' + subErr);
		        return;
		      }
					var count = 0
					// console.log(prices)
		      for (var coin in prices) {
						if (choices[count].allocation > 0){
							// console.log('allocation > 0');
							choices[count].price = prices[coin]['USD']
						}
						count = count + 1
		      }
					// create new game entry
					GameEntry.findOneAndUpdate({
						gameId: req.params.gameId,
						userId: req.params.userId
					}, {
						$set: {
							gameId: req.params.gameId,
							userId: req.params.userId,
							currentChoices: choices,
							unallocated_capcoin: unallocated,
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
									coinBalance: -10,
								}
							}, (userError, userResult) => {
								if (userError || !userResult) {
									res.status(500).send('unable to update user capcoin balance');
									return;
								}

								// add initial entry to Trade collection as first trade
								Trade.create({
									gameId: req.params.gameId,
									userId: req.params.userId,
									choices: req.body.choices,
									isInitial: true
								}, (createTradeError, newTrade) => {
									if (createTradeError || !newTrade) {
										res.status(422).send('unable to add inital allocations to trade collection');
										return;
									}

									// we made it
									res.status(200).send(newResult);
								});
							});
					});
				});
			});

		// update existing entry
	} else {
			var newChoices = req.body.choices
			var unallocatedCapCoinLeft = result[0].unallocated_capcoin
			// ensure below 10 capcoin limit
			var totalCapcoin = 0;
			newChoices.forEach(choice => totalCapcoin += parseFloat(choice.allocation));

			var tickerString = "";
			for (var i = 0; i < newChoices.length; i++) {
				if (i != newChoices.length - 1) {
					tickerString = tickerString.concat(newChoices[i].symbol, ",");
				} else {
					tickerString = tickerString.concat(newChoices[i].symbol);
				}
			}
			// console.log(tickerString);

			if (totalCapcoin > result.unallocated_capcoin) {
				res.status(200).json({
					'error': 'over capcoin limit for game, i.e. exceeds available unallocated capcoin limit'
				});
				return;
			}

			getJSON('https://min-api.cryptocompare.com/data/pricemulti?fsyms=' + tickerString + '&tsyms=USD', (subErr, prices) => {
				if (subErr || !prices) {
					res.status(422).send('Unable to retrieve price - please check https://min-api.cryptocompare.com. Error: ' + subErr);
					return;
				}
				var count = 0
				// console.log(prices)
				for (var coin in prices) {
					if (newChoices[count].allocation > 0){
						// console.log('allocation > 0');
						newChoices[count].price = prices[coin]['USD']
					}
					count = count + 1
				}

				//choices now contains the updated prices and allocations for any choices any trades made
				//update the coinballance and unallocated balance appropriaey.

				var oldChoices = result[0].currentChoices
				var noFunds = 0;

				// cancel out any super small amounts of a coin a user might be in and add it back to their unallocated balance
				var residualFundsToAdd = 0
				oldChoices.forEach(oldChoice => {
					newChoices.forEach(newChoice => {
						if (oldChoice.symbol == newChoice.symbol){
							if (oldChoice.allocation < 0.05 && newChoice.allocation < 0.05){
								oldChoice.allocation = 0
								residualFundsToAdd = residualFundsToAdd + parseFloat(newChoice.allocation)
								newChoice.allocation = 0
							}
						}
					});
				});

				console.log("residuals")
				console.log(residualFundsToAdd)

				// var updatedCoinBalance = result[0].coin_balance
				var updatedALlocatedCoin = result[0].unallocated_capcoin + residualFundsToAdd
				oldChoices.forEach(oldChoice => {
					newChoices.forEach(newChoice => {

						if (oldChoice.symbol == newChoice.symbol){
							console.log("old alc and price, new alc and price, symbol")
							console.log(oldChoice.allocation)
							console.log(oldChoice.price)
							console.log(newChoice.allocation)
							console.log(newChoice.price)
							console.log(oldChoice.symbol)




							//BUY ORDER
							if (oldChoice.allocation < newChoice.allocation){
								var diffCC = newChoice.allocation - oldChoice.allocation
								if (diffCC > updatedALlocatedCoin) {
									console.log('insufficient funds, not enough unallocated CC left')
									res.status(422).send('insufficient funds, not enough unallocated CC left');
									noFunds = 1
								} else{
									// var percentChange = ((newChoice.price - oldChoice.price)/oldChoice.price) * 100
									// updatedCoinBalance = updatedCoinBalance + (percentChange * oldChoice.allocation)
									newChoice.allocation = (oldChoice.allocation) + diffCC
									updatedALlocatedCoin = updatedALlocatedCoin - diffCC
								}
							}
							//SELL ORDER
							else if (oldChoice.allocation > newChoice.allocation){
								var diffCC = oldChoice.allocation - newChoice.allocation
								console.log("Sell order")
								console.log(diffCC)
								if (diffCC < 0){
									console.log('insufficient funds, not enough unallocated CC left')
									res.status(422).send('insufficient funds, not enough unallocated CC left to sell' );
									noFunds = 1
								}
								// var percentChange = 1 - (((currentPrice - oldPrice)/(oldPrice)) * -1)
								// updatedCoinBalance = updatedCoinBalance + (percentChange * oldChoice.allocation)
								newChoice.allocation = (oldChoice.allocation) - diffCC
								updatedALlocatedCoin = updatedALlocatedCoin + (diffCC)
							}
						}
					});
				});

				//only update entry if we had the funds
				if (noFunds == 0){
					GameEntry.findOneAndUpdate({
						gameId: req.params.gameId,
						userId: req.params.userId
					}, {
						$set: {
							gameId: req.params.gameId,
							userId: req.params.userId,
							currentChoices: newChoices,
							unallocated_capcoin: updatedALlocatedCoin,
							last_updated: Date.now()
						}
					}, {
						upsert: true,
						new: true,
						setDefaultsOnInsert: true
					}, (upError, upResult) => {
						if (upError || !upResult) {
							console.log("here")
							res.status(500).send('unable to update game entry');
							return;

						// update initial trade for user
						} else {
							Trade.findOneAndUpdate({
								gameId: req.params.gameId,
								userId: req.params.userId
							}, {
								$set: {
									choices: newChoices
								}
							}, (tradeError, tradeResult) => {
								if (tradeError || !tradeResult) {
									console.log("asdfasdf")
									res.status(500).send('unable to update initial trade');
									return;
								}

								// we made it
								res.status(200).send(upResult);
							});
						}
					});
				}
			});
		}
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
	const schedulerTokenHash = req.body.schedulerTokenHash;

	// compare schedular token hash with stored token
	var isErr = false;
	bcrypt.compare(process.env.SCHEDULER_TOKEN, schedulerTokenHash, (err, isMatch) => {
		if (err) {
			res.status(422).send('Unable to verify token.');
			isErr = true;
		}

		// raise error if no match
		if (!isMatch) {
			res.status(422).send('Invalid token.');
			isErr = true;
		}
	});

	// bail if error was raised
	if (isErr) {
		return;
	}

	/****************************************
	 **	COMMENTING OUT FOR CS98 GALA DEMO  **
	 ****************************************/

	// var today = new Date();
	// if (today.getDay() != 5) {
	// 	res.status(422).send('ERROR: new games can only be created on Fridays')
	// 	return;
	// }

	// start datetime in 1 hour
	var startDate = new Date();
	startDate.setMinutes(0);
	startDate.setSeconds(0);
	startDate.setMilliseconds(0);
	startDate.setHours(startDate.getHours() + 1);

	// end datetime in 24 hours
	var endDate = new Date();
	endDate.setMinutes(0);
	endDate.setSeconds(0);
	endDate.setMilliseconds(0);
	endDate.setDate(endDate.getDate() + 1);

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
		const cryptoCompareTickers = req.app.locals.resources.tickers;
		const randChoices = req.app.locals.resources.randomChoices;
		while (choices.length < randChoices + mcChoices) {
			let randomRank = numCoins * Math.random() << 0;
			if (!(randomRank in flags)) {
				for (var obj in cryptos.data) {

					// limit to tickers on cryptocompare
					if (parseInt(cryptos.data[obj].rank) == randomRank && cryptoCompareTickers[cryptos.data[obj].symbol]) {
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
	const schedulerTokenHash = req.body.schedulerTokenHash;
	const blockchainNode = req.app.locals.resources.blockchainNode;

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
			},
			has_ended: false
		})
		.sort('-finish_date')
		.exec((error, result) => {
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
						coins: coinChoices,
						has_ended: true
					}
				}, (updateErr, updateRes) => {
					if (updateErr) {
						res.status(500).send('unable to set end prices for game ' + game._id);
						return;
					}

					// give capcoin winnings back to all users
					var updateError = 'none';
					var userBalances = [];
					GameEntry.find({
						gameId: game._id
					}, (entryErr, entryRes) => {

						// collect user end game balances
						entryRes.forEach(entry => {
							var winnings = entry.coin_balance > 0 ? entry.coin_balance : 0;
							userBalances.push({ 'user':entry.userId, 'capcoin':winnings });
						});

						// add winnings to capcoin blockchain
						var reqBody = { 'balances': userBalances };
						var params = { method: 'POST', body: reqBody, json: true, url: blockchainNode + '/add' };
						request.post(params, (error, response, body) => {});

						// manually add winnings for error checking
						userBalances.forEach(balance => {
							User.findOneAndUpdate({ _id: balance['user'] }, { $inc: { coinBalance: balance['capcoin'] }}, (winningsErr, winningsRes) => {
								updateError = winningsErr ? 'unable to update capcoin balance for user \'' + balance['user'] + '\'. ERROR: ' + err : 'none';
							});
						});
					});

					// send back errors if any
					if (updateError != 'none') {
						res.status(500).send(updateError);
						return;
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
	const schedulerTokenHash = req.body.schedulerTokenHash;

	// compare schedular token hash with stored token
	var isErr = false;
	bcrypt.compare(process.env.SCHEDULER_TOKEN, schedulerTokenHash, (err, isMatch) => {
		if (err) {
			res.status(422).send('Unable to verify token.');
			isErr = true;
		}

		// raise error if no match
		if (!isMatch) {
			res.status(422).send('Invalid token.');
			isErr = true;
		}
	});

	// bail if error was raised
	if (isErr) {
		return;
	}

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
			game.coins.forEach(coin => {
				const startPrice = prices[coin.name] ? parseFloat(prices[coin.name]['USD']) : null;
				coinChoices.push({
					"name": coin.name,
					"startPrice": startPrice,
					"endPrice": null});
			});

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

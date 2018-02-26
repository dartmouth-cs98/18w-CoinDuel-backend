/*
 * leaderboard_controller.js
 *
 * API endpoints for the leaderboard front-end view
 * Feb 25 2018
 * Kooshul Jhaveri
 */

import User from '../models/user.js';
import Game from '../models/game.js';
import GameEntry from '../models/gameentry.js';

const getJSON = require('get-json');

// returns sorted leaderboard list for specified game
// @param req, ex. { }
export const getRankings = (req, res) => {
	const gameId = req.params.gameId;

	// get initial coin prices for game
  	Game.findById(gameId, (err, result) => {
	    if (err || !result) {
	      res.status(422).send('No game found with id ' + gameId);
	      return;
	    }

	    // save tickers and prices in obj
	    var initialPrices = {};
	    result.coins.forEach(coin => initialPrices[coin.name] = coin.value);

	    // get current prices of coins
	    var currentPrices = {};
	    getJSON('https://api.coinmarketcap.com/v1/ticker/?limit=0', (err2, result2) => {
	    	if (err2 || !result2) {
	    		res.status(422).send('Unable to retrieve prices - please check http://api.coinmarketcap.com/. ERROR: ' + err2);
	    		return;
	    	}

	      	// store game's current coin prices
	      	result2.forEach(crypto => {
	      		if (initialPrices[crypto.symbol]) currentPrices[crypto.symbol] = parseFloat(crypto.price_usd);
	      	});

	      	// loop through each entry of the game
	      	GameEntry.find({ gameId }, (err3, result3) => {
		      	result3.forEach((entry) => {

		      		// calculate entry's current capcoin balance
		      		let coin_balance = 0;
		      		entry.choices.forEach((choice) => {
		      			let percent_change = 1 - (initialPrices[choice.symbol] / currentPrices[choice.symbol]);
		      			coin_balance += (1 + percent_change) * choice.allocation;
		      		});

		      		// save updated coin_balance in entry document
		      		entry.update({ $set: { coin_balance: coin_balance, last_updated: Date.now() }}, (err4, result4) => {
		      			if (err4 || !result4) {
		      				res.status(500).send('Error saving updated coin balance. ERROR: ' + err2);
	    					return;
		      			} 	
		      		});
		 		})

		      	// generate ranked order of entries
				GameEntry.find({ gameId }, { _id: 0, coin_balance: 1, userId: 1 })
				.sort('-coin_balance')
				.populate('userId', 'username')
				.then((result4) => {
					res.json(result4);
				})
				.catch((error) => {
					res.status(500).json({ error });
				});
			});
		});
	});
}
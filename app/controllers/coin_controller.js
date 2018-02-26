/*
 * coin_controller.js
 *
 * Cryptocurrency coin operations via CoinMarketCap
 * 14 Feb 2018
 * Josh Kerber
 */

import Game from '../models/game.js';
import GameEntry from '../models/gameentry.js';
import CapcoinHistory from '../models/capcoin_history.js';

// for calls to CoinMarketCap
const getJSON = require('get-json');

/*
 * Get the current data about a cryptocurrency.
 * @param req, ex. {symbol: 'ETH'}
 */
export const getCoin = (req, res) => {
  const symbol = req.params.symbol;
  const tickers = req.app.locals.resources.tickers;   // global ticker dict

  // check if request has ticker
  if (!symbol) {
    res.status(422).send('You must provide a cryptocurrency ticker.');
    return;
  }

  // ensure ticker is a valid cryptocurrency
  var coinId = tickers[symbol];
  if (!coinId) {
    res.status(422).send('Coin with ticker \'' + symbol + '\' not found.');
  } else {

    // get coin data from CoinMarketCap
    getJSON('https://api.coinmarketcap.com/v1/ticker/' + coinId + '/', (err, crypto) => {
      if (err) {
        res.status(422).send('Unable to retrieve price - please check http://api.coinmarketcap.com/. ERROR: ' + err);
        return;
      }

      // send back data as object
      res.status(200).send(crypto[0]);
    });
  }
};

/*
 * Get the current prices for coins in a specific game.
 * @param req, ex. { gameId: '5a8608233d378876bf62d819'}
 */
export const getCoinPrices = (req, res) => {
  const gameId = req.params.gameId;

  // get initial coin prices for game
  Game.findById(gameId, (err, result) => {
    if (err) {
      res.status(422).send('No game found with id ' + gameId);
      return;
    }

    // save tickers and prices in obj
    var initialPrices = {};
    result.coins.forEach(coin => initialPrices[coin.name] = coin.value);

    // get current prices of coins
    var currentPrices = {};
    getJSON('https://api.coinmarketcap.com/v1/ticker/?limit=0', (subErr, cryptos) => {
      if (subErr) {
        res.status(422).send('Unable to retrieve prices - please check http://api.coinmarketcap.com/. ERROR: ' + subErr);
        return;
      }

      // store user's coin's current prices
      cryptos.forEach(crypto => {
        if (initialPrices[crypto.symbol]) currentPrices[crypto.symbol] = parseFloat(crypto.price_usd);
      });

      // calculate return for each coin
      var fullResults = {'gameId': gameId, 'prices':{}};
      result.coins.forEach(coin => {
        let ticker = coin.name;
        fullResults.prices[ticker] = currentPrices[ticker].toString();
      });
      res.status(200).send(fullResults);
    });
  });
};

/*
 * Get the current return for a user's cryptocurrencies during a game.
 * @param req, ex. { gameId: '5a8608233d378876bf62d819', userId: '5a8607d6971c50fbf29726a5'}
 */
export const getCoinReturns = (req, res) => {
  const gameId = req.params.gameId;
  const userId = req.params.userId;

  // get initial coin prices for game
  Game.findById(gameId, (err, result) => {
    if (err) {
      res.status(422).send('No game found with id ' + gameId);
      return;
    }

    // save tickers and prices in obj
    var initialPrices = {};
    result.coins.forEach(coin => initialPrices[coin.name] = coin.value);

    // get current prices of coins
    var currentPrices = {};
    getJSON('https://api.coinmarketcap.com/v1/ticker/?limit=0', (subErr, cryptos) => {
      if (subErr) {
        res.status(422).send('Unable to retrieve prices - please check http://api.coinmarketcap.com/. ERROR: ' + subErr);
        return;
      }

      // store user's coin's current prices
      cryptos.forEach(crypto => {
        if (initialPrices[crypto.symbol]) currentPrices[crypto.symbol] = parseFloat(crypto.price_usd);
      });

      // get users coin choices
      GameEntry.findOne({ gameId: gameId, userId: userId }, (subSubErr, entry) => {
        if (subSubErr) {
          res.status(422).send('No game entries found for user ' + userId + ' and game ' + gameId);
          return;
        }

        // calculate return for each coin
        var fullResults = {'userId': userId, 'gameId': gameId, 'returns':{}};
        entry.choices.forEach(choice => {
          let ticker = choice.symbol;
          let percentChange = (currentPrices[ticker] - initialPrices[ticker]) / currentPrices[ticker];
          let capCoin = choice.allocation * percentChange + choice.allocation;
          fullResults.returns[ticker] = {
            'initialPrice': initialPrices[ticker].toString(),
            'currentPrice': currentPrices[ticker].toString(),
            'allocation': choice.allocation.toString(),
            'capCoin': capCoin.toString(),
            'percent': (percentChange * 100).toString() };
        });
        res.status(200).send(fullResults);
      });
    });
  });
};

/*
 * Get the a user's capcoin history.
 * @param req, ex. { userId: '5a8607d6971c50fbf29726a5' }
 */
export const getCapcoinHistory = (req, res) => {
  const userId = req.params.userId;

  // get all history for user
  CapcoinHistory.find({ userId: userId }, (err, history) => {
    if (err || !history) {
      res.status(422).send('No capcoin history for user \'' + userId + '\'');
      return;
    }

    // clean up data
    var balances = [];
    history.forEach(entry => balances.push({'date': entry['date'], 'balance': entry['balance']}));
    res.status(200).send(balances);
  });
};

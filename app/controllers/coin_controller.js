/*
 * coin_controller.js
 *
 * Cryptocurrency coin operations via CoinMarketCap
 * 14 Feb 2018
 * Josh Kerber
 */

import Game from '../models/game.js';
import GameEntry from '../models/gameentry.js';

// for calls to CoinMarketCap
const getJSON = require('get-json');

/*
 * Get the current data about a cryptocurrency.
 * @param req, ex. {symbol: 'ETH'}
 */
export const getCoin = (req, res) => {
  const symbol = req.body.symbol;
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
    var priceDict = result.coins;

    // get current prices of
    var currentPrices = {};
    getJSON('https://api.coinmarketcap.com/v1/ticker/', (err, cryptos) => {
      if (err) {
        res.status(422).send('Unable to retrieve prices - please check http://api.coinmarketcap.com/. ERROR: ' + err);
        return;
      }

      // find user's coins
      cryptos.forEach(crypto => {
        if (priceDict[crypto.symbol]) {

        }
      });

    });

    // get users coin choices
    GameEntry.findOne({ gameId: gameId, userId: userId }, (err, result) => {
      if (err) {
        res.status(422).send('No game entries found for user ' + userId + ' and game ' + gameId);
        return;
      }
      var returns = {};

      // calculate return for each coin
      Object.keys(result.choices).forEach(coin => {
        // cap coin amount in 'result.choices.coin'
        // starting price in priceDict.*coin*
        returns[coin] = {'capCoin':0, 'percent':0}
        returns.coin.capCoin =
        returns.coin.percent =
      });
      res.status(200).send(returns);
    });
  });
};

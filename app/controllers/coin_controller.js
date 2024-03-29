/*
 * coin_controller.js
 *
 * Cryptocurrency coin operations via CryptoCompare
 * 14 Feb 2018
 * Josh Kerber
 */

import Game from '../models/game.js';
import GameEntry from '../models/gameentry.js';
import CapcoinHistory from '../models/capcoin_history.js';

// for calls to CryptoCompare
const getJSON = require('get-json');

/*
 * Get the current ticker url for a cryptocurrency.
 * @param req, ex. {ticker: 'ETH'}
 */
export const getCoinLogo = (req, res) => {
  const symbol = req.params.ticker;
  const tickerDict = req.app.locals.resources.tickers; // global id dict

  // check if request has ticker
  if (!symbol) {
    res.status(422).send('You must provide a cryptocurrency ticker.');
    return;
  }

  // map ticker to CryptoCompare id
  let coinId = tickerDict[symbol] ? tickerDict[symbol]['id'] : null;
  if (!coinId) {
    res.status(422).send('Invalid ticker.');
    return;
  }

  // get coin logo from CryptoCompare
  getJSON('https://www.cryptocompare.com/api/data/coinsnapshotfullbyid/?id=' + coinId, (err, crypto) => {
    if (err) {
      res.status(422).send('Unable to retrieve logo - please check https://min-api.cryptocompare.com. Error: ' + err);
      return;
    }

    // get logo
    let logoUrl = crypto['Data']['General']['ImageUrl'];
    let description = crypto['Data']['General']['Features'];

    // send back data as object
    res.status(200).json({'url': 'https://www.cryptocompare.com' + logoUrl, 'description': description});
  });
};

/*
 * Get the current data about a cryptocurrency.
 * @param req, ex. {symbol: 'ETH'}
 */
export const getCoin = (req, res) => {
  const symbol = req.params.symbol;
  const tickerDict = req.app.locals.resources.tickers; // global id dict
  const numArticles = 3;

  // check if request has ticker
  if (!symbol) {
    res.status(422).send('You must provide a cryptocurrency ticker.');
    return;
  }

  // get coin id from dict
  const coinId = tickerDict[symbol] ? tickerDict[symbol]['id'] : null;
  if (!coinId) {
    res.status(422).send('Ticker not found in local app resources.');
    return;
  }

  // get coin price
  getJSON('https://min-api.cryptocompare.com/data/price?fsym=' + symbol + '&tsyms=USD', (resErr, crypto) => {
    if (resErr || !crypto) {
      res.status(422).send('Unable to retrieve price - please check https://min-api.cryptocompare.com. Error: ' + err);
      return;
    }

    // get coin snapshot
    getJSON('https://min-api.cryptocompare.com/data/v2/news/?categories=' + symbol + '&excludeCategories=Sponsored', (newsErr, news) => {
      if (newsErr || !news) {
        res.status(422).send('Unable to news - please check https://min-api.cryptocompare.com. Error: ' + err);
        return;
      }

      // get coin snapshot
      getJSON('https://www.cryptocompare.com/api/data/coinsnapshotfullbyid/?id=' + coinId, (snapErr, snapshot) => {
        if (snapErr || snapshot['Response'] == 'Error') {
          res.status(422).send('Unable to retrieve snapshot - please check https://min-api.cryptocompare.com. Error: ' + err);
          return;
        }

        // send back data as object
        const coinName = tickerDict[symbol] ? tickerDict[symbol]['name'] : null;
        const coinInfo = snapshot['Data']['General'];
        const coinData = {
          'name':coinName,
          'price':crypto['USD'],
          'logo':'http://www.cryptocompare.com' + coinInfo['ImageUrl'],
          'description':coinInfo['Description'],
          'url':coinInfo['WebsiteUrl'],
          'articles':news['Data'].slice(0, numArticles)
        };
        res.send(200, coinData);
      });
    });
  });
};

/*
 * Get the current prices for coins in a specific game.
 * @param req, ex. { gameId: '5a8608233d378876bf62d819'}
 */
export const getCoinPrices = (req, res) => {
  const gameId = req.params.gameId;

  // get initial coin prices for game
  Game.findById(gameId, (err, result) => {
    if (err || !result) {
      res.status(422).send('No game found with id ' + gameId);
      return;
    }

    // format string for API call
    var tickerString = "";
    for (var i = 0; i < result.coins.length; i++) {
      if (i != result.coins.length - 1) {
        tickerString = tickerString.concat(result.coins[i].name, ",");
      } else {
        tickerString = tickerString.concat(result.coins[i].name);
      }
    }

    getJSON('https://min-api.cryptocompare.com/data/pricemulti?fsyms=' + tickerString + '&tsyms=USD', (err, prices) => {
      if (err || !prices) {
        res.status(422).send('Unable to retrieve price - please check https://min-api.cryptocompare.com. Error: ' + err);
        return;
      }

      // calculate return for each coin
      var fullResults = {
        'gameId': gameId,
        'prices': {}
      };
      for (var coin in prices) {
        fullResults.prices[coin] = prices[coin]['USD'];
      }
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
  const returnMagnifier = req.app.locals.resources.returnMagnifier; // global return magnifier

  // get initial coin prices for game
  Game.findById(gameId, (err, result) => {
    if (err || !result) {
      res.status(422).send('No game found with id ' + gameId);
      return;
    }

    var tickerString = "";
    for (var i = 0; i < result.coins.length; i++) {
      if (i != result.coins.length - 1) {
        tickerString = tickerString.concat(result.coins[i].name, ",");
      } else {
        tickerString = tickerString.concat(result.coins[i].name);
      }
    }

    // get current prices of coins
    getJSON('https://min-api.cryptocompare.com/data/pricemulti?fsyms=' + tickerString + '&tsyms=USD', (subErr, prices) => {
      if (subErr || !prices) {
        res.status(422).send('Unable to retrieve price - please check https://min-api.cryptocompare.com. Error: ' + subErr);
        return;
      }

      // save tickers and prices in obj
      var initialPrices = {};
      result.coins.forEach(coin => {
        initialPrices[coin.name] = coin.startPrice;
      });

      var currentPrices = {};
      for (var coin in prices) {
        currentPrices[coin] = parseFloat(prices[coin]['USD']);
        // set initial price to current price if game hasn't started
        initialPrices[coin] = initialPrices[coin] ? initialPrices[coin] : currentPrices[coin];
      }

      // get users current coin choices
      GameEntry.findOne({
        gameId: gameId,
        userId: userId
      }, (subSubErr, entry) => {
        if (subSubErr || !entry) {
          res.status(422).send('No game entries found for user ' + userId + ' and game ' + gameId);
          return;
        }

        // calculate return for each coin
        var fullResults = {
          'userId': userId,
          'gameId': gameId,
          'returns': {}
        };
        entry.currentChoices.forEach(choice => {
          let ticker = choice.symbol;
          let percentChange = (currentPrices[ticker] - initialPrices[ticker]) / initialPrices[ticker];
          let capCoin = choice.allocation * percentChange;

          // magnify returns
          capCoin *= returnMagnifier;
          capCoin += choice.allocation;
          fullResults.returns[ticker] = {
            'initialPrice': initialPrices[ticker].toString(),
            'currentPrice': currentPrices[ticker].toString(),
            'allocation': choice.allocation.toString(),
            'capCoin': capCoin.toString(),
            'percent': (percentChange * 100).toString()
          };
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
  CapcoinHistory.find({
    userId: userId
  }, (err, history) => {
    if (err || !history) {
      res.status(422).send('No capcoin history for user \'' + userId + '\'');
      return;
    }

    // clean up data
    var balances = [];
    history.forEach(entry => balances.push({
      'date': entry['date'],
      'balance': entry['balance']
    }));
    res.status(200).send(balances);
  });
};

/*
 * Get the a user's capcoin history during a specified game.
 * @param req, ex. { gameId: '5a8608233d378876bf62d819', userId: '5a8607d6971c50fbf29726a5'}
 */
export const getCapcoinHistoryForGame = (req, res) => {
  const userId = req.params.userId;
  const gameId = req.params.gameId;

  // get all history for user during game
  CapcoinHistory.find({
    userId: userId,
    gameId: gameId
  }, (err, history) => {
    if (err || !history) {
      res.status(422).send('No capcoin history for user \'' + userId + '\' during game \'' + gameId + '\'');
      return;
    }

    // clean up data
    var balances = [];
    history.forEach(entry => balances.push({
      'date': entry['date'],
      'balance': entry['balance']
    }));
    res.status(200).send(balances);
  });
};

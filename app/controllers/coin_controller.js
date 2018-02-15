/*
 * coin_controller.js
 *
 * Cryptocurrency coin operations via CoinMarketCap
 * 14 Feb 2018
 * Josh Kerber
 */

const getJSON = require('get-json');

/*
 * Get the current data about a cryptocurrency.
 * @param req, ex. {symbol: 'ETH'}
 */
export const getCoin = (req, res) => {
  const symbol = req.body.symbol;
  const tickers = req.app.locals.tickers;   // global ticker dict

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
    var priceReq = getJSON('https://api.coinmarketcap.com/v1/ticker/' + coinId + '/', (err, crypto) => {
      if (err) {
        res.status(422).send('Unable to retrieve price - please check http://api.coinmarketcap.com/. ERROR: ' + err);
        return;
      }

      // send back data as object
      res.send(crypto[0]);
    });
  }
};

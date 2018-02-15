/*
 * price_controller.js
 *
 * Cryptocurrency price operations.
 * 14 Feb 2018
 * Josh Kerber
 */

const getJSON = require('get-json');

/*
 * Get the current price of a cryptocurrency.
 * @param req, ex. {symbol: 'BTC'}
 * @param res, ex. {price: 123.45}
 */
export const getPrice = (req, res) => {
  const symbol = req.body.symbol;
  const tickers = req.app.locals.tickers;

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

    // get coin price from CoinMarketCap
    var priceReq = getJSON('https://api.coinmarketcap.com/v1/ticker/' + coinId + '/', (err, crypto) => {
      if (err) {
        res.status(422).send('Unable to retrieve price - please check http://api.coinmarketcap.com/. ERROR: ' + err);
        return;
      }

      // send back price
      res.send({'price': crypto[0].price_usd});
    });
  }
};

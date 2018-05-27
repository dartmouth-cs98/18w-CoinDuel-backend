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
import CapcoinHistory from '../models/capcoin_history.js';

const getJSON = require('get-json');

/*
* Sets leaderboard list during game.
* @param req, ex. { }
*/
export const setRankings = (req, res) => {
  // end game flag
  const endGame = "endGame" in req.body;
  const returnMagnifier = req.app.locals.resources.returnMagnifier; // global return magnifier

  // get latest game
  var date = Date.now();
  Game.find({
    start_date: {
      $lt: date
    }
  })
  .sort('-start_date').exec((error, result) => {

    // no games found
    if (!result || result.length == 0) {
      res.status(422).send('Couldn\'t find games.');
      return;
    }
    var game = result[0];

    // no games in progress and not end game
    if (!endGame && game.finish_date < date) {
      res.status(422).send('no end game flag & no games currently in progress - nothing to update')
      return;
    }

    // save tickers and prices in obj
    var initialPrices = {};
    game.coins.forEach(coin => initialPrices[coin.name] = coin.startPrice);

    // format string for API call
    var tickerString = "";
    for (var i = 0; i < game.coins.length; i++) {
      if (i != game.coins.length - 1) {
        tickerString = tickerString.concat(game.coins[i].name, ",");
      } else {
        tickerString = tickerString.concat(game.coins[i].name);
      }
    }

    // get current coin prices through CryptoCompare API call
    getJSON('https://min-api.cryptocompare.com/data/pricemulti?fsyms=' + tickerString + '&tsyms=USD', (err, prices) => {
      if (err || !prices) {
        res.status(422).send('Unable to retrieve price - please check https://min-api.cryptocompare.com. Error: ' + err);
        return;
      }

      // loop through each entry (user) of the game
      let updateError = '';
      GameEntry.find({
        gameId: game._id
      }, (error, result) => {
        result.forEach(entry => {

          // calculate and update user's capcoin balance if game in progress OR end of game
          var coinBalance = 0;
          entry.currentChoices.forEach((choice) => {
            console.log("Initial price:");
            console.log(initialPrices[choice.symbol]);
            if (initialPrices[choice.symbol] != null) {
              console.log("Got here");
              let percent_change = 1 - (initialPrices[choice.symbol] / parseFloat(prices[choice.symbol]['USD']));

              // magnify returns
              percent_change *= returnMagnifier;
              coinBalance += (1 + percent_change) * choice.allocation;
            } else {
              coinBalance += choice.allocation;
            }
          });

          coinBalance += entry.unallocated_capcoin


          // update entry with new balance
          entry.update({
            $set: {
              coin_balance: coinBalance
            }
          }, (updateErr, updateRes) => {
            if (updateErr) {
              updateError = 'Unable to update capcoin balance for user \'' + entry.userId + '\'. ERROR: ' + updateErr;
              return;
            }
          });

          // add entry to history collection
          CapcoinHistory.create({
            gameId: game.gameId,
            userId: entry.userId,
            date: Date.now(),
            balance: coinBalance
          }, (updateErr, updateRes) => {
            if (updateErr) {
              updateError = 'Unable to add entry to collection for user \'' + entry.userId + '\'. ERROR: ' + updateErr;
              return;
            }
          });
        });
        if (updateError != '') res.status(500).send(updateError);
        else res.status(200).send('succesful');
      });
    });
  });
}

// returns sorted leaderboard list for specified game
// and sets capcoin balance for game
// @param req, ex. { gameId: '12783687126387172836'}
export const getRankings = (req, res) => {
  const gameId = req.params.gameId;
  const returnMagnifier = req.app.locals.resources.returnMagnifier; // global return magnifier

  // get initial coin prices for game
  Game.findById(gameId, (err, result) => {
    if (err || !result) {
      res.status(422).send('No game found with id ' + gameId);
      return;
    }

    // save tickers and prices in obj
    var initialPrices = {};
    result.coins.forEach(coin => initialPrices[coin.name] = coin.startPrice);

    // format string for API call
    var tickerString = "";
    for (var i = 0; i < result.coins.length; i++) {
      if (i != result.coins.length - 1) {
        tickerString = tickerString.concat(result.coins[i].name, ",");
      } else {
        tickerString = tickerString.concat(result.coins[i].name);
      }
    }

    // get current coin prices through CryptoCompare API call
    getJSON('https://min-api.cryptocompare.com/data/pricemulti?fsyms=' + tickerString + '&tsyms=USD', (err2, prices) => {
      if (err2 || !prices) {
        res.status(422).send('Unable to retrieve price - please check https://min-api.cryptocompare.com. Error: ' + err2);
        return;
      }


      // loop through each entry of the game
      var updateError = '';
      GameEntry.find({
        gameId
      }, (err3, result3) => {
        result3.forEach((entry) => {

          // calculate entry's current capcoin balance
          let initial_coin_balance = entry.coin_balance
          let coin_balance = 0;
          entry.currentChoices.forEach((choice) => {
            if (initialPrices[choice.symbol] != null) {
              let percent_change = 1 - (initialPrices[choice.symbol] / parseFloat(prices[choice.symbol]['USD']));

              // magnify returns
              percent_change *= returnMagnifier;
              coin_balance += (1 + percent_change) * choice.allocation;
            } else {
              coin_balance += choice.allocation;
            }
          });
          coin_balance += entry.unallocated_capcoin

          // save updated coin_balance in entry document if game is in progress
          var date = Date.now();
          if (result.start_date < date && result.finish_date > date) {
            entry.update({
              $set: {
                coin_balance: coin_balance,
                last_updated: Date.now()
              }
            }, (err4, result4) => {
              if (err4 || !result4) {
                updateError = 'Error saving updated coin balance. Error: ' + err4;
                return;
              }
            });
          }
        });

        // send back errors if any
        if (updateError != '') {
          res.status(500).send(updateError);
          return;
        }

        // generate ranked order of entries
        GameEntry.find({
          gameId
        }, {
          _id: 0,
          coin_balance: 1,
          userId: 1
        })
        .sort('-coin_balance')
        .populate('userId', 'username')
        .then((result4) => {
          res.json(result4);
        })
        .catch((error) => {
          res.status(500).send(error);
        });
      });
    });
  });
}

// returns sorted leaderboard list for all time game
// @param req, ex. { }
export const getAllTimeRankings = (req, res) => {
  const returnMagnifier = req.app.locals.resources.returnMagnifier; // global return magnifier

  // retrieve active game id and update balances with live prices
  Game.find({
    finish_date: {
      $gt: Date.now()
    }
  })
  .sort('finish_date')
  .limit(1)
  .then(result => {

    // no current game
    if (!result[0] || result[0].start_date > Date.now()) {
      User.find({}, (err, result2) => {
        var user_data = []

        // create array of all users
        result2.forEach(user => {
          user_data.push({
            userId: user.id,
            username: user.username,
            coin_balance: user.coinBalance,
            profilePicture: user.profile_url
          });
        });

        // sort by coin balance
        user_data.sort((a, b) => {
          return (a.coin_balance < b.coin_balance) ? 1 : ((a.coin_balance > b.coin_balance) ? -1 : 0);
        });
        res.json(user_data);
        return;
      });

    // current game
    } else {
      const gameId = result[0].id;

      // get initial coin prices for game
      Game.findById(gameId, (err, result) => {
        if (err || !result) {
          res.status(422).send('No game found with id ' + gameId);
          return;
        }

        // save tickers and prices in obj
        var initialPrices = {};
        result.coins.forEach(coin => initialPrices[coin.name] = coin.startPrice);

        // format string for API call
        var tickerString = "";
        for (var i = 0; i < result.coins.length; i++) {
          if (i != result.coins.length - 1) {
            tickerString = tickerString.concat(result.coins[i].name, ",");
          } else {
            tickerString = tickerString.concat(result.coins[i].name);
          }
        }

        // get current coin prices through CryptoCompare API call
        getJSON('https://min-api.cryptocompare.com/data/pricemulti?fsyms=' + tickerString + '&tsyms=USD', (err2, prices) => {
          if (err2 || !prices) {
            res.status(422).send('Unable to retrieve price - please check https://min-api.cryptocompare.com. Error: ' + err2);
            return;
          }

          // loop through each entry of the game
          var balances = {};
          var updateError = '';
          GameEntry.find({
            gameId
          }, (err3, result3) => {
            result3.forEach(entry => {

              // calculate entry's current capcoin balance
              let initial_coin_balance = entry.coin_balance
              let coin_balance = 0;
              entry.currentChoices.forEach(choice => {
                if (initialPrices[choice.symbol] != null) {
                  let percent_change = 1 - (initialPrices[choice.symbol] / parseFloat(prices[choice.symbol]['USD']));
                  // magnify returns
                  percent_change *= returnMagnifier;
                  coin_balance += (1 + percent_change) * choice.allocation;
                } else {
                  coin_balance += choice.allocation;
                }
              });
              coin_balance += entry.unallocated_capcoin
              balances[entry.userId] = coin_balance;

              // save updated coin_balance in entry document
              entry.update({
                $set: {
                  coin_balance: coin_balance,
                  last_updated: Date.now()
                }
              }, (err4, result4) => {
                if (err4 || !result4) {
                  updateError = 'Error saving updated coin balance. ERROR: ' + err4;
                  return;
                }
              });
            });

            // send back errors if any
            if (updateError != '') {
              res.status(500).send(updateError);
              return;
            }

            // sum up the user's all time balance and the current game balance (if it exists)
            var usernames = {};
            var profilePictures = {};
            User.find({}, (err4, result4) => {
              result4.forEach((entry) => {
                if (balances[entry.id]) {
                  balances[entry.id] += entry.coinBalance;
                } else {
                  balances[entry.id] = entry.coinBalance;
                }
                usernames[entry.id] = entry.username;
                profilePictures[entry.id] = entry.profile_url;
              });

              // create an array of Objects, sort by coin balance, and send the array as a JSON response
              var user_data = []
              for (var userId in usernames) {
                user_data.push({
                  userId,
                  username: usernames[userId],
                  coin_balance: balances[userId],
                  profilePicture: profilePictures[userId]
                });
              }
              user_data.sort((a, b) => {
                return (a.coin_balance < b.coin_balance) ? 1 : ((a.coin_balance > b.coin_balance) ? -1 : 0);
              });
              res.json(user_data);
            });
          });
        });
      });
    }
  }).catch(error => {
    res.status(500).send(error);
  });
}

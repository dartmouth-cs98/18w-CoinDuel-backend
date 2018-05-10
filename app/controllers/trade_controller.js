/*
 * trade_controller.js
 *
 * API endpoints to deal with CRUD operations for in-game trades
 * May 10 2018
 * Josh Kerber
 */

import User from '../models/user.js';
import Trade from '../models/trade.js';
import GameEntry from '../models/gameentry.js';

/*
 * Submit an in-game trade, update current allocations.
 * @param req, ex. { 'gameId':xxx,
 *                   'userId':xxx,
 *                   'choices':[ {'symbol':'ETH', 'allocation':8},...,{'symbol':'BTC', 'allocation':2} ],
 *                   'timestamp':*unix time*}
 */
export const submitTrade = (req, res) => {
  // add new trade to collection
  Trade.create({
    gameId: req.params.gameId,
    userId: req.params.userId,
    choices: req.body.choices
  }, (error, trade) => {

    // unable to create trade
    if (error || !trade) {
      res.status(500).send('unable to create trade');
      return;

    // update game entry with new lineup
    } else {
      GameEntry.findOneAndUpdate({
        gameId: req.params.gameId,
        userId: req.params.userId
      }, {
        $set: {
          currentChoices: req.body.choices,
          last_updated: Date.now()
        }
      }, (updateError, entry) => {

        // unable to update entry with new lineup, delete trade
        if (updateError || !entry) {
          res.status(500).send('unable to make trade – error updating game entry');
          trade.remove();
          return;

        // update user's balance
        } else {
          // TODO
        }
      });
    }
  });
};

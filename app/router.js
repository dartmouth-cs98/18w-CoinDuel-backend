import { Router } from 'express';
import * as User from './controllers/user_controller.js';
import * as Game from './controllers/game_controller.js';
import * as Coin from './controllers/coin_controller.js';

const router = Router();

// user controller
router.route('/user')
  .get(User.getAllUsers)
  .post(User.findUser)
  .delete(User.deleteUser);

// coin controller
router.route('/coin/:symbol')
  .get(Coin.getCoin);
router.route('/return/:gameId/:userId')
  .get(Coin.getCoinReturns);
router.route('/game/prices/:gameId')
  .get(Coin.getCoinPrices);
router.route('/capcoin/:userId')
  .get(Coin.getCapcoinHistory);

// signup user
router.post('/signup', User.signup);

// game controller
router.get('/game', Game.getLatestGame);

router.route('/game/:gameId/:userId')
  .get(Game.getEntry)
  .post(Game.createAndUpdateEntry)
  .put(Game.createAndUpdateEntry)
  .delete(Game.deleteEntry)

export default router;

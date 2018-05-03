import { Router } from 'express';
import { requireAuth, requireSignin } from './services/passport';
import * as User from './controllers/user_controller.js';
import * as Game from './controllers/game_controller.js';
import * as Coin from './controllers/coin_controller.js';
import * as Test from './controllers/test_controller.js';
import * as Leaderboard from './controllers/leaderboard_controller.js';

const router = Router();

router.get('/', (req, res) => {
  res.send('cryptos always, in all ways');
});

// for testing
router.route('/test')
  .get(requireAuth, Test.test)

// user auth
router.post('/signup', User.signup);
router.post('/signin', requireSignin, User.signin);

// user controller
router.route('/user')
  .get(User.getAllUsers)
  .post(User.findUser)
  .delete(User.deleteUser);

// user verification
router.route('/verify/:verificationId')
  .get(User.verifyUser);

// coin controller
router.route('/coin/:symbol')
  .get(Coin.getCoin);

router.route('/return/:gameId/:userId')
  .get(Coin.getCoinReturns);

router.route('/game/prices/:gameId')
  .get(Coin.getCoinPrices);

router.route('/capcoin/:userId')
  .get(Coin.getCapcoinHistory);

router.route('/capcoin/:gameId/:userId')
  .get(Coin.getCapcoinHistoryForGame);

// game controller
router.get('/game', Game.getLatestGame);
router.get('/game/performance/:gameId/:userId', Game.getCapcoinPerformanceForGame);
router.post('/game/create', Game.createNextGame);
router.post('/game/initialize', Game.initializeGame);
router.post('/game/end', Game.endGame);

router.route('/game/:gameId/:userId')
  .get(Game.getEntry)
  .post(Game.createAndUpdateEntry)
  .put(Game.createAndUpdateEntry)
  .delete(Game.deleteEntry)

// leaderboard controller
router.route('/leaderboard/:gameId')
  .get(Leaderboard.getRankings);

router.route('/leaderboard/update')
  .post(Leaderboard.setRankings);

router.route('/leaderboard/')
  .get(requireAuth, Leaderboard.getAllTimeRankings);

export default router;

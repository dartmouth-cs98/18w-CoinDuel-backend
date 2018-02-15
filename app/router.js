import { Router } from 'express';
import * as User from './controllers/user_controller.js';
import * as Coin from './controllers/coin_controller.js';

const router = Router();

// user controller
router.route('/user')
  .get(User.getAllUsers)
  .post(User.findUser)
  .delete(User.deleteUser);

// coin controller
router.route('/coin')
  .get(Coin.getCoin);

// signup user
router.post('/signup', User.signup);

export default router;

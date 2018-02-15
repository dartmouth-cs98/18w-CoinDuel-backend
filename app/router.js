import { Router } from 'express';
import * as User from './controllers/user_controller.js';
import * as Game from './controllers/game_controller.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'coinduel me' });
});


router.post('/', function (req, res) {
  res.send('Got a POST request')
  console.log(req.body);
})

router.route('/user')
  .get(User.getAllUsers)
  .post(User.findUser)
  .delete(User.deleteUser);

router.post('/signup', User.signup);

router.get('/game', Game.getLatestGame);

router.route('/game/:gameId/:userId')
  .get(Game.getEntry)
  .post(Game.createAndUpdateEntry)
  .put(Game.createAndUpdateEntry)
  .delete(Game.deleteEntry)

export default router;

import { Router } from 'express';
import * as User from './controllers/user_controller.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'coinduel me' });
});


router.get('/', User.findUser);

router.post('/', function (req, res) {
  res.send('Got a POST request')
})

router.route('/user')
  .get(User.findUser)
  .delete(User.deleteUser);

router.post('/signup', User.signup);

export default router;

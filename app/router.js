import { Router } from 'express';
import * as User from './controllers/user_controller.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'coinduel me' });
});


router.post('/', function (req, res) {
  res.send('Got a POST request')
  console.log(req.body);
})

router.route('/user')
  .post(User.findUser)
  .delete(User.deleteUser);

router.post('/signup', User.signup);

export default router;

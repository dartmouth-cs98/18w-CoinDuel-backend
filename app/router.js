import { Router } from 'express';
import * as User from './controllers/user_controller.js';

const router = Router();

router.get('/hello', (req, res) => {
  // res.json({ message: 'coinduel me' });
  res.send('Hello, coinduel');
});

router.post('/signin', User.signup);

export default router;

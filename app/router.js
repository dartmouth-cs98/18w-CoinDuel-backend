import { Router } from 'express';
import * as User from './controllers/user_controller.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'coinduel me' });
});

///your routes will go here
router.post('/signin', UserController.signup);

export default router;

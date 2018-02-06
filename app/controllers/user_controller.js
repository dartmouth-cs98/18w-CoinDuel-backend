

import User from '../models/user.js';

export const signup = (req, res, next) => {
  console.log('sign up started');
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;

  const newUser = new User();
  newUser.email = email;
  newUser.password = password;
  newUser.username = username;
  newUser.save()
    .then((result) => {
      res.send({ token: tokenForUser(result) });
    })
    .catch(err => {
      res.status(400).send(`${err}`);
    });

  if (!email || !password || !username) {
    return res.status(422).send('You must provide an email, a password, and a username to sign up!');
  }

  // add query to check if user exists
};

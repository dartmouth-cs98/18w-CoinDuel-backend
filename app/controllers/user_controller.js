/*
 * user_controller.js
 *
 * User endpoints interactions
 * 14 Feb 2018
 * Rajiv Ramaiah
 */

import User from '../models/user.js';

export const signup = (req, res, next) => {
  console.log('sign up started');
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  console.log(req.body);

  if (!email || !password || !username) {
    return res.status(422).send('You must provide an email, a password, and a username to sign up!');
  }
  // add query to check if user exists
  User.findOne({ "username": username })
  .then((user) => {
      if (user) {
        return res.status(422).send('The password or email or username you entered has been taken!');
      }
      else {
        const newUser = new User();
        newUser.email = email;
        newUser.password = password;
        newUser.username = username;
        newUser.save()
          .then((result) => {
            res.send('success');
          })
          .catch(err => {
            res.send(`${err}`);
          });
      }
    }
  )
  .catch(err => {
    res.status(400).send(`${err}`);
  });
};

// check if user exists
export const findUser = (req, res) => {
  console.log("checking for user");
  console.log(req.body);
  // find user
  User.findOne({ "username": req.body.username })
  .then((user) => {
      if (user) {
        res.send(user);
      }
      else {
        return res.status(422).send('No user found!');
      }
    }
  )
  .catch(err => {
    res.status(400).send(`${err}`);
  });
};

// return a list of all users in the app
export const getAllUsers = (req, res) => {
  console.log("getting all users");
  // add query to check if user exists
  User.find()
  .then((users) => {
      if (users) {
        res.send(users);
      }
      else {
        return res.status(422).send('No users found!');
      }
    }
  )
  .catch(err => {
    res.status(400).send(`${err}`);
  });
};

// delete a user, used for account deletion
export const deleteUser = (req, res) => {
  console.log('DELETE USER');
  User.remove({ "username": req.body.username })
   .then(() => {
     res.json({ message: 'Usage successfully deleted!' });
   })
   .catch(error => {
     res.json({ error });
   });
};

// Rajiv Ramaiah , CoinDuel 2018

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
      res.send('success');
    })
    .catch(err => {
      res.send(`${err}`);
    });

  if (!email || !password || !username) {
    return res.status(422).send('You must provide an email, a password, and a username to sign up!');
  }

  // add query to check if user exists
};

export const findUser = (req, res) => {
  const reqUser = req.user;

  User.findById({ _id: reqUser._id })
   .then(user => {
     if (user.profilePicKey !== '') {
       var paramsTwo = { Bucket: 'snap-app-bucket', Key: user.profilePicKey }; //eslint-disable-line
       s3.getSignedUrl('getObject', paramsTwo, (err, Url) => {
         console.log('\n\nThe new Signed URL is', Url);
         User.findOneAndUpdate({ _id: reqUser._id }, {
           profilePicURL: Url,
         }).then(() => {
           console.log('Updated Snaps URL');
           User.findById({ _id: reqUser._id })
             .then((userToReturn) => {
               console.log('\n\nUSER TO RETURN', userToReturn);
               res.send(userToReturn);
             })
           .catch(error => {
             res.json({ error });
           });
         })
         .catch(error => {
           res.json({ error });
         });
       });
     } else {
       res.send(reqUser);
     }
   })
 .catch(error => {
   res.json({ error });
 });
};

export const deleteUser = (req, res) => {
  console.log('DELETE USER ID', req.user._id);
  User.remove({ _id: req.user._id })
   .then(() => {
     res.json({ message: 'Usage successfully deleted!' });
   })
   .catch(error => {
     res.json({ error });
   });
};



export const signin = (req, res, next) => {
  console.log('sign in started');
  res.send({ token: tokenForUser(req.user) });
};

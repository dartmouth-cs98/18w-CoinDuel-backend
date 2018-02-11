// From http://cs52.me/assignments/sa/server-side/

import express from 'express';
import mongoose from 'mongoose';
import apiRouter from './router.js';
import bodyParser from 'body-parser';


// instantiate app
const app = express();

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '8mb' }));


// display hello world
app.get('/', (req, res) => {
  res.send('Hello, cryptocasdfasdfurrency world!');
});

app.use('/api', apiRouter);

// startup server
const port = process.env.PORT || 9000;
app.listen(port);


console.log(`listening on: ${port}`);


// database setup
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/coinduel';
mongoose.connect(mongoURI);
mongoose.Promise = global.Promise;

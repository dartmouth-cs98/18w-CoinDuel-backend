// From http://cs52.me/assignments/sa/server-side/

import express from 'express';
import mongoose from 'mongoose';
import apiRouter from './router';
import bodyParser from 'body-parser';

// instantiate app
const app = express();

// store crypto tickers
const tickers = require('./resources/ticker.json');
app.locals.tickers = tickers;

// enable json message body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '8mb' }));
app.use('/api', apiRouter);

// display hello world
app.get('/', (req, res) => res.send('Hello, cryptocurrency world!'));

// startup server
const port = process.env.PORT || 9000;
app.listen(port);

console.log(`listening on: ${port}`);

// database setup
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/coinduel';
mongoose.connect(mongoURI);
mongoose.Promise = global.Promise;

// display local servers
console.log(`listening on: ${port}`);
console.log(`listening on: ${mongoURI}`);

// From http://cs52.me/assignments/sa/server-side/

import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import apiRouter from './router';
import resources from './resources';
import bodyParser from 'body-parser';

// instantiate app
const app = express();
const path = require('path');

// cross origin resource sharing
app.use(cors());

// load in resources
app.locals.resources = resources;

// enable json message body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '8mb' }));
app.use('/api', apiRouter);

// // allow static files
// app.use(express.static(path.join(__dirname, 'public')));

// display hello world
app.get('/', (req, res) => res.send('Hello, cryptocurrency world!'));

// startup server
const port = process.env.PORT || 9000;
app.listen(port);

// database setup
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/coinduel';
// const mongoURI = 'mongodb://localhost/coinduel';

mongoose.connect(mongoURI);
mongoose.Promise = global.Promise;

// display local servers
console.log(`listening on: ${port}`);
console.log(`listening on: ${mongoURI}`);

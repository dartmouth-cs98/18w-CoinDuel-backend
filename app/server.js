// From http://cs52.me/assignments/sa/server-side/

import express from 'express';
import mongoose from 'mongoose';

// instantiate app
const app = express();

// database
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/coinduel';
mongoose.connect(mongoURI);
mongoose.Promise = global.Promise;

// display hello world
app.get('/', (req, res) => res.send('Hello, world!'));

// startup server
const port = process.env.PORT || 8888;
app.listen(port);

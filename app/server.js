import express from 'express';

// instantiate app
const app = express();

// display hello world
app.get('/', (req, res) => res.send('Hello, world!'));

// startup server
const port = process.env.PORT || 8888;
app.listen(port);

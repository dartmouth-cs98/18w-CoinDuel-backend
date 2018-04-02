# CoinDuel backend

Backend API repo for CoinDuel iOS app.

https://coinduel-cs98.herokuapp.com/api/{endpoint}

Look at the router.js file to view all the different endpoints created. They include creating a new user, initializing a new game, retrieving the leaderboard, viewing a user's current/all-time live balance, and more.

* Data models:

```
User: {
    email: { type: String, unique: true, lowercase: true },
    username: String,
    password: String,
    profile_url: { type: String, default: 'profile' },
    coinBalance: { type: Number, default: 0 }
},
Game: {
    start_date: { type: Date, default: Date.now },
    finish_date: { type: Date },
    coins: [{ name: { type: String }, startPrice: { type: Number }, endPrice: { type: Number }}],
},
GameEntry: {
    gameId: { type: Schema.Types.ObjectId, ref: 'Game' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    choices: [{ symbol: { type: String }, allocation: { type: Number, min: 0, max: 10 }}],
    coin_balance: { type: Number, default: 0 },
    last_updated: { type: Date, default: Date.now }
},
CapcoinHistory: {
    gameId: { type: Schema.Types.ObjectId, ref: 'Game' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    balance: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
}
```
## Architecture

The backend is comprised of Node.js and Express for the server, and MongoDB for the database.

## Setup

1) clone backend repo
1.5) If necessary, get homebrew and download mongo using 'brew install mongodb'
2) 'brew services start mongodb' OR 'mongod' (if not using brew)
3) Open the mongo shell with 'mongo' and copy paste the code from test_data.js into the shell
4) npm install
5) npm run dev
6) To test, try http://localhost:9000/api/game. This should return the most recent game from test_data.js.
###### runs on port 9000

## Deployment

Heroku, using an automatic scheduler for certain jobs

## Authors

Kooshul Jhaveri, Josh Kerber, Anish Chadalavada, Mitchell Revers, Rajiv Ramaiah, Henry Wilson

## Acknowledgments

N/A

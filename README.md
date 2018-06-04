# CoinDuel backend

Backend API repo for CoinDuel iOS app.

https://coinduel-cs98.herokuapp.com/api/{endpoint}

Look at the router.js file to view all the different endpoints created. They include creating a new user, initializing a new game, retrieving the leaderboard, viewing a user's current/all-time live balance, and more.

* Data models:

```
User: {
    email: { type: String, unique: true, lowercase: true },
    username: { type: String },
    password: { type: String },
    verified: { type: Boolean, default: false },
    verificationId: { type: String },
    profile_url: { type: String, default: 'profile' },
    coinBalance: { type: Number, default: 0 },
    oneSignalId: { type: String },
    lastGameId : {type: String, default: ' '}
},
Game: {
    start_date: { type: Date, default: Date.now },
    finish_date: { type: Date },
    has_ended: { type: Boolean, default: false },
    coins: [{ name: { type: String }, startPrice: { type: Number }, endPrice: { type: Number }}],
},
GameEntry: {
    gameId: { type: Schema.Types.ObjectId, ref: 'Game' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    currentChoices: [{ symbol: { type: String }, allocation: { type: Number, min: 0, max: 10 }, price: {type: Number, default: null }}],
    coin_balance: { type: Number, default: 10 },
    unallocated_capcoin: { type: Number, default: 10},
    trades: [{ symbol: { type: String }, allocation: { type: Number, min: 0, max: 10 }, price: { type: Number, default: null }, timestamp: { type: Date, default: Date.now }}],
    last_updated: { type: Date, default: Date.now },
    game_performance: [{ time: { type: Number, default: 0 }, unixTime: { type: Number, default: Date.now }, capCoin: {type: Number, default: 0 }
}
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

## Blockchain

ADD HERE JOSH

## Authors

Kooshul Jhaveri, Josh Kerber, Anish Chadalavada, Mitchell Revers, Rajiv Ramaiah, Henry Wilson

## Acknowledgments

Tim Tregubov, for helping us make CoinDuel a reality!!!

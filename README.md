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

After each game, users' Capcoin winnings are stored on a blockchain. A user mines their balance on the blockchain to receive their winnings. Our blockchain is built with Python and is loosely modeled after Bitcoin's blockchain. It is based on the tutorial found here: https://medium.com/crypto-currently/lets-make-the-tiniest-blockchain-bigger-ac360a328f4d.

##### What is a blockchain?

"[A blockchain is] a public database where new data are stored in a container called a block and are added to an immutable chain (hence blockchain) with data added in the past" - Gerald Nash, https://medium.com/crypto-currently/lets-build-the-tiniest-blockchain-e70965a248b.
In short, a blockchain is a public ledger of transactions that rely on the trust of the public to execute. For our blockchain, all transactions are from the game and to the user, and rely on the user's participation in the game to execute, i.e. a user will only be able to mine their Capcoin winnings if they log time in the app after a game.

##### Our Capcoin Block Schema
A Capcoin block is instantiated using the following Python snippet...
```
def __init__(self, index, timestamp, data, previous_hash):
    self.index = index
    self.timestamp = timestamp
    self.data = data
    self.previous_hash = previous_hash
    self.hash = self.hashBlock()
```
As seen above, a single Capcoin Block stores:
1. index of the block (number of games a user has played)
2. timestamp of the creation of the block
3. any form of data (in our case, always a Capcoin balance)
4. hash of the previous block for proof-of-work (explained below)
5. hash of the block, formed by hashing all of its own data

##### Mining & Our Proof of Work Algorithm
In popular cryptocurrencies like Bitcoin, a proof-of-work is a datapoint (usually a number) that verifies "mining" work has been done on the transactions of a block on the blockchain. Mining is required to verify and execute a transaction. For our blockchain, we use an extremely simple proof-of-work algorithm:
```
def proofOfWork(lastProof):
    """proof of work algorithm"""
    # generate proof of work by incrementing variable
    incrementor = lastProof + 1
    while not (incrementor % POW_CONST == 0 and incrementor % lastProof == 0):
        incrementor += 1
    return incrementor
```
Our proof-of-work for a block will simply be the next multiple of an arbitrary constant (POW_CONST) that is also divisible by the previous proof-of-work on the chain. When a user opens our app after they participate in a game, the app will mine their winnings on the blockchain by accessing the proof-of-work generated from the previous game they played. Capcoin's POW_CONST is currently initialized to 5 to ensure extremely quick transaction verification. To put this in perspective, it would take several thousand years to mine a single Bitcoin on a MacBookPro. Capcoin mining takes seconds.

## Authors

Kooshul Jhaveri, Josh Kerber, Anish Chadalavada, Mitchell Revers, Rajiv Ramaiah, Henry Wilson

## Acknowledgments

Tim Tregubov, for helping us make CoinDuel a reality!!!
